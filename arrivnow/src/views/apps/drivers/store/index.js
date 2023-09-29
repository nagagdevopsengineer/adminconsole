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

export const getAllData = createAsyncThunk('appDrivers/getAllData', async () => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/drivers/?populate=*&sort=createdAt:DESC`)
    return response.data.data
  } else {
    const c_uuid = localStorage.getItem('contractor_uuid')
    const response = await axiosObj.get(`/api/drivers/?filters[contractor][id]=${c_uuid}&populate=*&sort=createdAt:DESC`)
    return response.data.data
  }
  
})

export const getData = createAsyncThunk('appDrivers/getData', async params => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/drivers/?populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  } else {
    const c_uuid = localStorage.getItem('contractor_uuid')
    const response = await axiosObj.get(`/api/drivers/?filters[contractor][id]=${c_uuid}&populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  }
})

export const getDriver = createAsyncThunk('appDrivers/getDriver', async id => {
  const response = await axiosObj.get(`/api/drivers/${id}/?populate=*`)
  return response.data.data
})

export const addDriver = createAsyncThunk('appDrivers/addDriver', async (driver, { dispatch, getState }) => {
  try {
      let avatar_image_id = ''
      let dl_image_id = ''
      let aadhar_image_id = ''
      let vc_image_id = ''

      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }

      if (driver.photo) {
        const formData = new FormData()
        formData.append('files', driver.photo)
        const response = await axiosObj.post('/api/upload', formData, config)
        avatar_image_id = response.data[0].id
      }
      if (driver.driving_licence_image) {
        const formData = new FormData()
        formData.append('files', driver.driving_licence_image)
        const response = await axiosObj.post('/api/upload', formData, config)
        dl_image_id = response.data[0].id
      }
      if (driver.aadhar_image) {
        const formData = new FormData()
        formData.append('files', driver.aadhar_image)
        const response = await axiosObj.post('/api/upload', formData, config)
        aadhar_image_id = response.data[0].id
      }
      if (driver.vaccinationcertificate) {
        const formData = new FormData()
        formData.append('files', driver.vaccinationcertificate)
        const response = await axiosObj.post('/api/upload', formData, config)
        vc_image_id = response.data[0].id
      }

      driver.aadhar_image = aadhar_image_id
      driver.driving_licence_image = dl_image_id
      driver.vaccinationcertificate = vc_image_id
      driver.photo = avatar_image_id

      await axiosObj.post('/api/drivers', {data: driver}).then(() => {
      handleClickMsg('Done!', 'Driver has been added successfully.', 'success')
      dispatch(getData(getState().drivers.params))
      return driver
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const updateDriver = createAsyncThunk('appDrivers/updateDriver', async (driver, { dispatch, getState }) => {
  try {
      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }

      let avatar_image_id = ''
      let dl_image_id = ''
      let aadhar_image_id = ''
      let vc_image_id = ''

      console.log(driver)

      if (driver.data.photo) {
        const formData = new FormData()
        formData.append('files', driver.data.photo)
        const response = await axiosObj.post('/api/upload', formData, config)
        avatar_image_id = response.data[0].id
      }

      if (driver.data.driving_licence_image) {
        const formData = new FormData()
        formData.append('files', driver.data.driving_licence_image)
        const response = await axiosObj.post('/api/upload', formData, config)
        dl_image_id = response.data[0].id
      }

      if (driver.data.aadhar_image) {
        const formData = new FormData()
        formData.append('files', driver.data.aadhar_image)
        const response = await axiosObj.post('/api/upload', formData, config)
        aadhar_image_id = response.data[0].id
      }

      if (driver.data.vaccinationcertificate) {
        const formData = new FormData()
        formData.append('files', driver.data.vaccinationcertificate)
        const response = await axiosObj.post('/api/upload', formData, config)
        vc_image_id = response.data[0].id
      }

      if (avatar_image_id) {
        driver.data.photo = avatar_image_id
      } else {
        delete driver.data.photo
      }
      if (dl_image_id) {
        driver.data.driving_licence_image = dl_image_id
      } else {
        delete driver.data.driving_licence_image
      }

      if (aadhar_image_id) {
        driver.data.aadhar_image = aadhar_image_id
      } else {
        delete driver.data.aadhar_image
      }

      if (vc_image_id) {
        driver.data.vaccinationcertificate = vc_image_id
      } else {
        delete driver.data.vaccinationcertificate
      }

      console.log(driver)

      await axiosObj.put(`/api/drivers/${driver.id}`, driver).then(() => {
      handleClickMsg('Done!', 'Driver has been updated successfully.', 'success')
      dispatch(getDriver(driver.id))
      dispatch(getData(getState().drivers.params))
      return driver
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const deleteDriver = createAsyncThunk('appDrivers/deleteDriver', async (id, { dispatch, getState }) => {
  try {
    await axiosObj.delete(`/api/drivers/${id}`).then(() => {
    handleClickMsg('Done!', 'Driver has been deleted successfully.', 'success')
    dispatch(getData(getState().drivers.params))
    return id
  })
} catch (err) {
  handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
}
})


export const getVaccinationStatus = createAsyncThunk('appDrivers/getVaccinationStatus', async () => {
  //const c_uuid = localStorage.getItem('client_uuid')
  const response = await axiosObj.get(`/api/vaccinestatuses/`)
  const vs_data = response.data.data
  const vaccine_status = []
  if (vs_data) {
    vs_data.map((vs) => {
      vaccine_status.push({value: vs.attributes.status, label: vs.attributes.status})
    })
  }
  return vaccine_status
})

export const appDriversSlice = createSlice({
  name: 'appDrivers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    block_data: false,
    vaccination_status: [],
    selectedDriver: null
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
      .addCase(getDriver.fulfilled, (state, action) => {
        state.selectedDriver = action.payload
      })
      .addCase(getVaccinationStatus.fulfilled, (state, action) => {
        state.vaccination_status = action.payload
      })
      .addCase(addDriver.pending, (state) => {
        state.block_data = true
      })
      .addCase(addDriver.fulfilled, (state) => {
        state.block_data = false
      })
      .addCase(updateDriver.pending, (state) => {
        state.block_data = true
      })
      .addCase(updateDriver.fulfilled, (state) => {
        state.block_data = false
      })
  }
})

export default appDriversSlice.reducer
