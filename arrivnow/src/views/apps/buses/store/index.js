// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Axios Imports
//import axios from 'axios'
import axiosObj from '@src/axios'

const MySwal = withReactContent(Swal)
const handleClickMsg = (title, msg, icon) => {
  return MySwal.fire({
    title,
    text: msg,
    icon,
    customClass: {
      confirmButton: 'btn btn-primary'
    }
  })
}

export const getAllData = createAsyncThunk('appBuses/getAllData', async () => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/buses/?populate=*&sort=createdAt:DESC`)
    return response.data.data
  } else {
    const c_uuid = localStorage.getItem('contractor_uuid')
    const response = await axiosObj.get(`/api/buses/?filters[contractor][id]=${c_uuid}&populate=*&sort=createdAt:DESC`)
    return response.data.data
  }
})

export const getData = createAsyncThunk('appBuses/getData', async params => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/buses/?populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  } else {
    const c_uuid = localStorage.getItem('contractor_uuid')
    const response = await axiosObj.get(`/api/buses/?filters[contractor][id]=${c_uuid}&populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  }
})

export const getBus = createAsyncThunk('appBuses/getBus', async id => {
  const response = await axiosObj.get(`/api/buses/${id}/?populate=*`)
  return response.data.data
})

export const addBus = createAsyncThunk('appBuses/addBus', async (bus, { dispatch, getState }) => {
  try {
    let rc_image_id = ''
    let puc_image_id = ''
    let fitness_image_id = ''

    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }
    if (bus.rc_certificate) {
      const formData = new FormData()
      formData.append('files', bus.rc_certificate)
      const response = await axiosObj.post('/api/upload', formData, config)
      rc_image_id = response.data[0].id
    }
    if (bus.puccertificate) {
      const formData = new FormData()
      formData.append('files', bus.puccertificate)
      const response = await axiosObj.post('/api/upload', formData, config)
      puc_image_id = response.data[0].id
    }
    if (bus.fitnesscertificate) {
      const formData = new FormData()
      formData.append('files', bus.fitnesscertificate)
      const response = await axiosObj.post('/api/upload', formData, config)
      fitness_image_id = response.data[0].id
    }

    bus.rc_certificate = rc_image_id
    bus.puccertificate = puc_image_id
    bus.fitnesscertificate = fitness_image_id

      await axiosObj.post('/api/buses', {data: bus}).then(() => {
      handleClickMsg('Done!', 'Bus has been added successfully.', 'success')
      dispatch(getData(getState().buses.params))
      return bus
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const updateBus = createAsyncThunk('appBuses/updateBus', async (bus, { dispatch, getState }) => {
  try {
      let rc_image_id = ''
      let puc_image_id = ''
      let fitness_image_id = ''

      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }
      if (bus.data.rc_certificate) {
        const formData = new FormData()
        formData.append('files', bus.data.rc_certificate)
        const response = await axiosObj.post('/api/upload', formData, config)
        rc_image_id = response.data[0].id
      }
      if (bus.data.puccertificate) {
        const formData = new FormData()
        formData.append('files', bus.data.puccertificate)
        const response = await axiosObj.post('/api/upload', formData, config)
        puc_image_id = response.data[0].id
      }
      if (bus.data.fitnesscertificate) {
        const formData = new FormData()
        formData.append('files', bus.data.fitnesscertificate)
        const response = await axiosObj.post('/api/upload', formData, config)
        fitness_image_id = response.data[0].id
      }

      if (rc_image_id) {
        bus.data.rc_certificate = rc_image_id
      } else {
        delete bus.data.rc_certificate
      }
      if (puc_image_id) {
        bus.data.puccertificate = puc_image_id
      } else {
        delete bus.data.puccertificate
      }
      if (fitness_image_id) {
        bus.data.fitnesscertificate = fitness_image_id
      } else {
        delete bus.data.fitnesscertificate
      }

      await axiosObj.put(`/api/buses/${bus.id}`, bus).then(() => {
      handleClickMsg('Done!', 'Bus has been updated successfully.', 'success')
      dispatch(getBus(bus.id))
      dispatch(getData(getState().buses.params))
      return bus
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const deleteBus = createAsyncThunk('appBuses/deleteBus', async (id, { dispatch, getState }) => {
   try {
      await axiosObj.delete(`/api/buses/${id}`).then(() => {
      handleClickMsg('Done!', 'Bus has been deleted successfully.', 'success')
      dispatch(getData(getState().buses.params))
      return id
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const appBusesSlice = createSlice({
  name: 'appBuses',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    block_data: false,
    selectedBus: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllData.fulfilled, (state, action) => {
        state.allData = action.payload
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getBus.fulfilled, (state, action) => {
        state.selectedBus = action.payload
      })
      .addCase(addBus.pending, (state) => {
        state.block_data = true
      })
      .addCase(addBus.fulfilled, (state) => {
        state.block_data = false
      })
      .addCase(updateBus.pending, (state) => {
        state.block_data = true
      })
      .addCase(updateBus.fulfilled, (state) => {
        state.block_data = false
      })
  }
})

export default appBusesSlice.reducer
