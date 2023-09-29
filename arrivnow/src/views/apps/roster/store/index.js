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

export const getAllData = createAsyncThunk('appRosters/getAllData', async () => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/bus-drivers/?populate=*&sort=createdAt:DESC`)
    return response.data.data
  } else {
    const c_uuid = localStorage.getItem('contractor_uuid')
    const response = await axiosObj.get(`/api/bus-drivers/?filters[bus][contractor][id]=${c_uuid}&populate=*&sort=createdAt:DESC`)
    return response.data.data
  }
})

export const getData = createAsyncThunk('appRosters/getData', async params => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/bus-drivers/?populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  } else {
    const c_uuid = localStorage.getItem('contractor_uuid')
    const response = await axiosObj.get(`/api/bus-drivers/?filters[bus][contractor][id]=${c_uuid}&populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  }
})

export const getRoster = createAsyncThunk('appRosters/getRoster', async id => {
  const response = await axios.get('/api/rosters/roster', { id })
  return response.data.roster
})

export const getAllDriver = createAsyncThunk('appClientRosters/getAllDriver', async () => {
  const c_uuid = localStorage.getItem('contractor_uuid')
  const response = await axiosObj.get(`/api/drivers/nmdrivers/${c_uuid}`)
  const driver_data = response.data
  const driver_list = []
  if (driver_data) {
    driver_data.map((driver) => driver_list.push({value: driver.id, label: driver.name}))
  }
  return driver_list
})

export const getAllHelper = createAsyncThunk('appClientRosters/getAllHelper', async () => {
  const c_uuid = localStorage.getItem('contractor_uuid')
  const response = await axiosObj.get(`/api/helpers/nmherpers/${c_uuid}`)
  const helper_data = response.data
  const helper_list = []
  if (helper_data) {
    helper_data.map((helper) => helper_list.push({value: helper.id, label: helper.name}))
  }
  return helper_list
})

export const getAllBus = createAsyncThunk('appClientRosters/getAllBus', async () => {
  const c_uuid = localStorage.getItem('contractor_uuid')
  const response = await axiosObj.get(`/api/buses/nmbusesdriver/${c_uuid}`)
  const bus_data = response.data
  const bus_list = []
  if (bus_data) {
    bus_data.map((bus) => { 
      const bus_label =  `${bus.vehicle_number} - ${bus.colour}`
      bus_list.push({value: bus.id, label: bus_label})
    })
  }
  return bus_list
})

export const addRoster = createAsyncThunk('appRoasters/addRoster', async (roster, { dispatch, getState }) => {
  try {
    await axiosObj.post('/api/bus-drivers', { data: roster}).then(() => {
      handleClickMsg('Done!', 'Roster has been added successfully.', 'success')
      dispatch(getData(getState().rosters.params))
      dispatch(getAllDriver())
      dispatch(getAllHelper())
      dispatch(getAllBus())
      return roster
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const deleteRoster = createAsyncThunk('appRosters/deleteRoster', async (id, { dispatch, getState }) => {
  try {
      await axiosObj.delete(`/api/bus-drivers/${id}`).then(() => {
      handleClickMsg('Done!', 'Roster has been deleted successfully.', 'success')
      dispatch(getData(getState().rosters.params))
      dispatch(getAllDriver())
      dispatch(getAllHelper())
      dispatch(getAllBus())
      return id
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const appRostersSlice = createSlice({
  name: 'appRosters',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    drivers: [],
    buses: [],
    helpers: [],
    block_data: false,
    selectedRoster: null
   
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
      .addCase(getRoster.fulfilled, (state, action) => {
        state.selectedRoster = action.payload
      })
      .addCase(getAllDriver.fulfilled, (state, action) => {
        state.drivers = action.payload
      })
      .addCase(getAllBus.fulfilled, (state, action) => {
        state.buses = action.payload
      })
      .addCase(getAllHelper.fulfilled, (state, action) => {
        state.helpers = action.payload
      })
      .addCase(addRoster.pending, (state) => {
        state.block_data = true
      })
      .addCase(addRoster.fulfilled, (state) => {
        state.block_data = false
      })
  }
})

export default appRostersSlice.reducer
