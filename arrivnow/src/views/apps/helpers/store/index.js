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

export const getAllData = createAsyncThunk('appHelpers/getAllData', async () => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/helpers/?populate=*&sort=createdAt:DESC`)
    return response.data.data
  } else {
    const c_uuid = localStorage.getItem('contractor_uuid')
    const response = await axiosObj.get(`/api/helpers/?filters[contractor][id]=${c_uuid}&populate=*&sort=createdAt:DESC`)
    return response.data.data
  }
})

export const getData = createAsyncThunk('appHelpers/getData', async params => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/helpers/?populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  } else {
    const c_uuid = localStorage.getItem('contractor_uuid')
    const response = await axiosObj.get(`/api/helpers/?filters[contractor][id]=${c_uuid}&populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  }
})

export const getHelper = createAsyncThunk('appHelpers/getHelper', async id => {
  const response = await axiosObj.get(`/api/helpers/${id}/?populate=*`)
  return response.data.data
})

export const addHelper = createAsyncThunk('appHelpers/addHelper', async (helper, { dispatch, getState }) => {
  try {
    let avatar_image_id = ''
    let vc_image_id = ''
    let aadhar_image_id = ''
    let dl_image_id = ''

    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }

    if (helper.photo) {
      const formData = new FormData()
      formData.append('files', helper.photo)
      const response = await axiosObj.post('/api/upload', formData, config)
      avatar_image_id = response.data[0].id
    }
    if (helper.vaccination_certificate) {
      const formData = new FormData()
      formData.append('files', helper.vaccination_certificate)
      const response = await axiosObj.post('/api/upload', formData, config)
      vc_image_id = response.data[0].id
    }
    if (helper.aadhar) {
      const formData = new FormData()
      formData.append('files', helper.aadhar)
      const response = await axiosObj.post('/api/upload', formData, config)
      aadhar_image_id = response.data[0].id
    }

    if (helper.drivinglicensefile) {
      const formData = new FormData()
      formData.append('files', helper.drivinglicensefile)
      const response = await axiosObj.post('/api/upload', formData, config)
      dl_image_id = response.data[0].id
    }

    helper.aadhar = aadhar_image_id
    helper.vaccination_certificate = vc_image_id
    helper.photo = avatar_image_id
    helper.drivinglicensefile = dl_image_id

    await axiosObj.post('/api/helpers', {data: helper}).then(() => {
    handleClickMsg('Done!', 'Helper has been added successfully.', 'success')
    dispatch(getData(getState().helpers.params))
    return helper
  })
} catch (err) {
  handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
}
})

export const updateHelper = createAsyncThunk('appHelpers/updateHelper', async (helper, { dispatch, getState }) => {
  try {
      let avatar_image_id = ''
      let vc_image_id = ''
      let aadhar_image_id = ''
      let dl_image_id = ''

      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }

      if (helper.data.photo) {
        const formData = new FormData()
        formData.append('files', helper.data.photo)
        const response = await axiosObj.post('/api/upload', formData, config)
        avatar_image_id = response.data[0].id
      }
      if (helper.data.vaccination_certificate) {
        const formData = new FormData()
        formData.append('files', helper.data.vaccination_certificate)
        const response = await axiosObj.post('/api/upload', formData, config)
        vc_image_id = response.data[0].id
      }
      if (helper.data.aadhar) {
        const formData = new FormData()
        formData.append('files', helper.data.aadhar)
        const response = await axiosObj.post('/api/upload', formData, config)
        aadhar_image_id = response.data[0].id
      }

      if (helper.data.drivinglicensefile) {
        const formData = new FormData()
        formData.append('files', helper.data.drivinglicensefile)
        const response = await axiosObj.post('/api/upload', formData, config)
        dl_image_id = response.data[0].id
      }

      if (aadhar_image_id) {
        helper.data.aadhar = aadhar_image_id
      } else {
        delete helper.data.aadhar
      }
      if (vc_image_id) {
        helper.data.vaccination_certificate = vc_image_id
      } else {
        delete helper.data.vaccination_certificate
      }
      if (avatar_image_id) {
        helper.data.photo = avatar_image_id
      } else {
        delete helper.data.photo
      }
      if (dl_image_id) {
        helper.data.drivinglicensefile = dl_image_id
      } else {
        delete helper.data.drivinglicensefile
      }

      await axiosObj.put(`/api/helpers/${helper.id}`, helper).then(() => {
      handleClickMsg('Done!', 'Helper has been updated successfully.', 'success')
      dispatch(getHelper(helper.id))
      dispatch(getData(getState().helpers.params))
      return helper
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const deleteHelper = createAsyncThunk('appHelpers/deleteHelper', async (id, { dispatch, getState }) => {
  try {
      await axiosObj.delete(`/api/helpers/${id}`).then(() => {
      handleClickMsg('Done!', 'Helper has been deleted successfully.', 'success')
      dispatch(getData(getState().helpers.params))
      return id
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const getVaccinationStatus = createAsyncThunk('appHelpers/getVaccinationStatus', async () => {
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

export const appHelpersSlice = createSlice({
  name: 'appHelpers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    block_data: false,
    vaccination_status: [],
    selectedHelper: null
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
      .addCase(getHelper.fulfilled, (state, action) => {
        state.selectedHelper = action.payload
      })
      .addCase(getVaccinationStatus.fulfilled, (state, action) => {
        state.vaccination_status = action.payload
      })
      .addCase(addHelper.pending, (state) => {
        state.block_data = true
      })
      .addCase(addHelper.fulfilled, (state) => {
        state.block_data = false
      })
      .addCase(updateHelper.pending, (state) => {
        state.block_data = true
      })
      .addCase(updateHelper.fulfilled, (state) => {
        state.block_data = false
      })
  }
})

export default appHelpersSlice.reducer
