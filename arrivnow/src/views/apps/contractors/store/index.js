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
  }).then(function() {
    const user_data = JSON.parse(localStorage.getItem('userData'))
    if (user_data.role === 'client') { 
      window.location.reload(false)
    }
  })
}

export const getAllData = createAsyncThunk('appContractors/getAllData', async () => {
  const c_uuid = localStorage.getItem('client_uuid')
  const response = await axiosObj.get(`/api/contractors/?filters[client][id]=${c_uuid}&populate=*&sort=createdAt:DESC`)
  return response.data.data
})

export const getData = createAsyncThunk('appContractors/getData', async params => {
  const c_uuid = localStorage.getItem('client_uuid')
  const response = await axiosObj.get(`/api/contractors/?filters[client][id]=${c_uuid}&populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
  return {
    params,
    data: response.data.data,
    totalPages: response.data.meta.pagination.total
  }
})

export const getContractor = createAsyncThunk('appContractors/getContractor', async id => {
  const response = await axiosObj.get(`/api/contractors/${id}/?populate=*`)
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'contractor') {
    const contractor_data = response.data.data
    user_data.fullName = contractor_data.attributes.name
    user_data.avatar = (contractor_data && contractor_data.attributes.logo.data) ? process.env.REACT_APP_IMAGEBASEURL + contractor_data.attributes.logo.data[0].attributes.url : ''
    localStorage.setItem('userData', JSON.stringify(user_data))
  } 
  return response.data.data
})

export const addContractor = createAsyncThunk('appContractors/addContractor', async (contractor, { dispatch, getState }) => {
  try {
      console.log(contractor)
      let avatar_image_id = ''
      let gst_image_id = ''
      let pan_image_id = ''

      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }

      if (contractor.photo) {
        const formData = new FormData()
        formData.append('files', contractor.photo)
        const response = await axiosObj.post('/api/upload', formData, config)
        avatar_image_id = response.data[0].id
      }
      if (contractor.gst_certificate) {
        const formData = new FormData()
        formData.append('files', contractor.gst_certificate)
        const response = await axiosObj.post('/api/upload', formData, config)
        gst_image_id = response.data[0].id
      } 
      if (contractor.pancardimage) {
        const formData = new FormData()
        formData.append('files', contractor.pancardimage)
        const response = await axiosObj.post('/api/upload', formData, config)
        pan_image_id = response.data[0].id
      } 

      if (gst_image_id) {
        contractor.gst_certificate = gst_image_id
      } else {
        delete contractor.gst_certificate
      }
      if (avatar_image_id) {
        contractor.photo = avatar_image_id
      } else {
        delete contractor.photo
      }
      if (pan_image_id) {
        contractor.pancardimage = pan_image_id
      } else {
        delete contractor.pancardimage
      }

      await axiosObj.post('/api/contractors', {data: contractor}).then(res => {
      handleClickMsg('Done!', 'Contractor has been added successfully.', 'success')
      localStorage.setItem('contractor_uuid', res.data.data.id)
      dispatch(getData(getState().contractors.params))
      return contractor
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const updateContractor = createAsyncThunk('appContractors/updateContractor', async (contractor, { dispatch, getState }) => {
  try {
      let avatar_image_id = ''
      let gst_image_id = ''
      let pan_image_id = ''

      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }

      if (contractor.data.photo) {
        const formData = new FormData()
        formData.append('files', contractor.data.photo)
        const response = await axiosObj.post('/api/upload', formData, config)
        avatar_image_id = response.data[0].id
      }
      if (contractor.data.gst_certificate) {
        const formData = new FormData()
        formData.append('files', contractor.data.gst_certificate)
        const response = await axiosObj.post('/api/upload', formData, config)
        gst_image_id = response.data[0].id
      } 
      if (contractor.data.pancardimage) {
        const formData = new FormData()
        formData.append('files', contractor.data.pancardimage)
        const response = await axiosObj.post('/api/upload', formData, config)
        pan_image_id = response.data[0].id
      } 

      if (gst_image_id) {
        contractor.data.gst_certificate = gst_image_id
      } else {
        delete contractor.data.gst_certificate
      }
      if (avatar_image_id) {
        contractor.data.photo = avatar_image_id
      } else {
        delete contractor.data.photo
      }
      if (pan_image_id) {
        contractor.data.pancardimage = pan_image_id
      } else {
        delete contractor.data.pancardimage
      }

      await axiosObj.put(`/api/contractors/${contractor.id}`, contractor).then(() => {
      handleClickMsg('Done!', 'Contractor has been updated successfully.', 'success')
      dispatch(getContractor(contractor.id))
      dispatch(getData(getState().contractors.params))
      return contractor
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const updateContractorLogo = createAsyncThunk('appClients/updateContractorLogo', async (contractor, { dispatch }) => {
  try {
      let avatar_image_id = ''

      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }
      if (contractor.data.photo) {
        const formData = new FormData()
        formData.append('files', contractor.data.photo)
        const response = await axiosObj.post('/api/upload', formData, config)
        avatar_image_id = response.data[0].id
      }

      if (avatar_image_id) {
        contractor.data.photo = avatar_image_id
      } else {
        delete contractor.data.photo
      }

      await axiosObj.put(`/api/contractors/${contractor.id}`, contractor).then(() => {
      handleClickMsg('Done!', 'Profile Pic has been updated successfully.', 'success')
      dispatch(getContractor(contractor.id))
      dispatch(getAllData())
      return contractor
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const deleteContractor = createAsyncThunk('appContractors/deleteContractor', async (id, { dispatch, getState }) => {
  try {
      console.log(id)
      await axiosObj.delete(`/api/contractors/${id}`).then(() => {
      handleClickMsg('Done!', 'Contractor has been deleted successfully.', 'success')
      dispatch(getData(getState().contractors.params))
      return id
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const appContractorsSlice = createSlice({
  name: 'appContractors',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    block_data: false,
    selectedContractor: null
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
      .addCase(getContractor.fulfilled, (state, action) => {
        state.selectedContractor = action.payload
      })
      .addCase(addContractor.pending, (state) => {
        state.block_data = true
      })
      .addCase(addContractor.fulfilled, (state) => {
        state.block_data = false
      })
      .addCase(updateContractor.pending, (state) => {
        state.block_data = true
      })
      .addCase(updateContractor.fulfilled, (state) => {
        state.block_data = false
      })
  }
})

export default appContractorsSlice.reducer
