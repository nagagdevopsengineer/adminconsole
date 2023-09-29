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

export const getAllData = createAsyncThunk('appClients/getAllData', async () => {
  const response = await axiosObj.get('/api/clients/?populate=*&sort=createdAt:DESC')
  return response.data.data
})

export const getData = createAsyncThunk('appClients/getData', async params => {
  const response = await axiosObj.get(`/api/clients/?populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
  return {
    params,
    data: response.data.data,
    totalPages: response.data.meta.pagination.total
  }
})

export const getClient = createAsyncThunk('appClients/getClient', async id => {
  const response = await axiosObj.get(`/api/clients/${id}/?populate=*`)
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'client') {
    const client_data = response.data.data
    user_data.fullName = client_data.attributes.name
    user_data.avatar = (client_data && client_data.attributes.logo.data) ? process.env.REACT_APP_IMAGEBASEURL + client_data.attributes.logo.data[0].attributes.url : ''
    localStorage.setItem('userData', JSON.stringify(user_data))
  } 
  return response.data.data
})

export const addClient = createAsyncThunk('appClients/addClient', async (client, { dispatch, getState }) => {
  try {
      let avatar_image_id = ''
      let gst_image_id = ''
      let pan_image_id = ''

      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }

      if (client.logo) {
        const formData = new FormData()
        formData.append('files', client.logo)
        const response = await axiosObj.post('/api/upload', formData, config)
        avatar_image_id = response.data[0].id
      }
      if (client.gstimage) {
        const formData = new FormData()
        formData.append('files', client.gstimage)
        const response = await axiosObj.post('/api/upload', formData, config)
        gst_image_id = response.data[0].id
      } 
      if (client.pancardimage) {
        const formData = new FormData()
        formData.append('files', client.pancardimage)
        const response = await axiosObj.post('/api/upload', formData, config)
        pan_image_id = response.data[0].id
      } 

      if (pan_image_id) {
        client.pancardimage = pan_image_id
      } else {
        delete client.pancardimage
      }
      if (avatar_image_id) {
        client.logo = avatar_image_id
      } else {
        delete client.logo
      }

      if (gst_image_id) {
        client.gstimage = gst_image_id
      } else {
        delete client.gstimage
      }

    await axiosObj.post('/api/clients', { data: client}).then(() => {
      handleClickMsg('Done!', 'Client has been added successfully.', 'success')
      dispatch(getData(getState().clients.params))
      return client
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const updateClient = createAsyncThunk('appClients/updateClient', async (client, { dispatch, getState }) => {
  try {
    let avatar_image_id = ''
    let gst_image_id = ''
    let pan_image_id = ''

    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }

    if (client.data.logo) {
      const formData = new FormData()
      formData.append('files', client.data.logo)
      const response = await axiosObj.post('/api/upload', formData, config)
      avatar_image_id = response.data[0].id
    }
    if (client.data.gstimage) {
      const formData = new FormData()
      formData.append('files', client.data.gstimage)
      const response = await axiosObj.post('/api/upload', formData, config)
      gst_image_id = response.data[0].id
    } 
    if (client.data.pancardimage) {
      const formData = new FormData()
      formData.append('files', client.data.pancardimage)
      const response = await axiosObj.post('/api/upload', formData, config)
      pan_image_id = response.data[0].id
    } 

    if (pan_image_id) {
      client.data.pancardimage = pan_image_id
    } else {
      delete client.data.pancardimage
    }
    if (avatar_image_id) {
      client.data.logo = avatar_image_id
    } else {
      delete client.data.logo
    }

    if (gst_image_id) {
      client.data.gstimage = gst_image_id
    } else {
      delete client.data.gstimage
    }
      await axiosObj.put(`/api/clients/${client.id}`, client).then(() => {
      handleClickMsg('Done!', 'Client has been updated successfully.', 'success')
      dispatch(getClient(client.id))
      dispatch(getData(getState().clients.params))
      return client
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const updateClientLogo = createAsyncThunk('appClients/updateClientLogo', async (client, { dispatch }) => {
  try {
      let avatar_image_id = ''

      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }
      console.log(client)
      if (client.data.logo) {
        const formData = new FormData()
        formData.append('files', client.data.logo)
        const response = await axiosObj.post('/api/upload', formData, config)
        avatar_image_id = response.data[0].id
      }

      if (avatar_image_id) {
        client.data.logo = avatar_image_id
      } else {
        delete client.data.logo
      }

      await axiosObj.put(`/api/clients/${client.id}`, client).then(() => {
      handleClickMsg('Done!', 'Profile Pic has been updated successfully.', 'success')
      dispatch(getClient(client.id))
      dispatch(getAllData())
      return client
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const deleteClient = createAsyncThunk('appClients/deleteClient', async (id, { dispatch, getState }) => {
  try {
      console.log(id)
      await axiosObj.delete(`/api/clients/${id}`).then(() => {
      handleClickMsg('Done!', 'Client has been deleted successfully.', 'success')
      dispatch(getData(getState().clients.params))
      return id
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const appClientsSlice = createSlice({
  name: 'appClients',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    block_data: false,
    selectedClient: null
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
      .addCase(getClient.fulfilled, (state, action) => {
        state.selectedClient = action.payload
      })
      .addCase(addClient.pending, (state) => {
        state.block_data = true
      })
      .addCase(addClient.fulfilled, (state) => {
        state.block_data = false
      })
      .addCase(updateClient.pending, (state) => {
        state.block_data = true
      })
      .addCase(updateClient.fulfilled, (state) => {
        state.block_data = false
      })
  }
})

export default appClientsSlice.reducer
