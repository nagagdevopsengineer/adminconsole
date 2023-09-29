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

export const getAllData = createAsyncThunk('appClientRosters/getAllData', async () => {
  //const c_uuid = localStorage.getItem('client_uuid')
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/route-buses/?populate=*&sort=createdAt:DESC`)
    return response.data.data
  } else {
    const c_uuid = localStorage.getItem('client_uuid')
    const response = await axiosObj.get(`/api/route-buses/?filters[route][client][id]=${c_uuid}&populate=*&sort=createdAt:DESC`)
    return response.data.data
  }
})

export const getData = createAsyncThunk('appClientRosters/getData', async params => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/route-buses/?populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  } else {
    const c_uuid = localStorage.getItem('client_uuid')
    const response = await axiosObj.get(`/api/route-buses/?filters[route][client][id]=${c_uuid}&populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  }
})

export const getRoster = createAsyncThunk('appClientRosters/getRoster', async id => {
  const response = await axios.get('/api/client_roster/roster', { id })
  return response.data.client_roster
})

export const getAllRoute = createAsyncThunk('appClientRosters/getAllRoute', async () => {
  const c_uuid = localStorage.getItem('client_uuid')
  const response = await axiosObj.get(`/api/routes/nmroutebus/${c_uuid}`)
  const route_data = response.data
  const route_list = []
  if (route_data) {
    route_data.map((route) => route_list.push({value: route.id, label: route.name}))
  }
  return route_list
})

export const getAllBus = createAsyncThunk('appClientRosters/getAllBus', async (id = null) => {
  //const c_uuid = localStorage.getItem('client_uuid')
  const bus_list = []
  if (id !== null) {
    const response = await axiosObj.get(`/api/buses/nmbusesroutes/${id}`)
    const bus_data = response.data
    
    if (bus_data) {
      bus_data.map((bus) => { 
        const bus_label =  `${bus.vehicle_number} - ${bus.colour}`
        bus_list.push({value: bus.id, label: bus_label})
      })
    }
  }
  return bus_list
})

export const addRoster = createAsyncThunk('appClientRosters/addRoster', async (client_roster, { dispatch, getState }) => {
  try {
    await axiosObj.post('/api/route-buses', { data: client_roster}).then(() => {
      handleClickMsg('Done!', 'Roster has been added successfully.', 'success')
      dispatch(getData(getState().client_rosters.params))
      dispatch(getAllRoute())
      dispatch(getAllBus())
      return client_roster
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const deleteRoster = createAsyncThunk('appClientRosters/deleteRoster', async (id, { dispatch, getState }) => {
  try {
      await axiosObj.delete(`/api/route-buses/${id}`).then(() => {
      handleClickMsg('Done!', 'Roster has been deleted successfully.', 'success')
      dispatch(getData(getState().client_rosters.params))
      dispatch(getAllRoute())
      dispatch(getAllBus())
      return id
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const getAllContractors = createAsyncThunk('appClientRosters/getAllContractors', async () => {
  const c_uuid = localStorage.getItem('client_uuid')
  const response = await axiosObj.get(`/api/contractors/?filters[client][id]=${c_uuid}&sort=createdAt:DESC`)
  const contractor_data = response.data.data
  const contractor_list = []
  if (contractor_data) {
    contractor_data.map((contractor) => {
      contractor_list.push({value: contractor.id, label: contractor.attributes.name})
    })
  }
  return contractor_list
})

export const appClientRostersSlice = createSlice({
  name: 'appClientRosters',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    routes: [],
    buses: [],
    contractors: [],
    block_data: false,
    selectedClientRoster: null
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
        state.selectedClientRoster = action.payload
      })
      .addCase(getAllRoute.fulfilled, (state, action) => {
        state.routes = action.payload
      })
      .addCase(getAllBus.fulfilled, (state, action) => {
        state.buses = action.payload
      })
      .addCase(getAllContractors.fulfilled, (state, action) => {
        state.contractors = action.payload
      })
      .addCase(addRoster.pending, (state) => {
        state.block_data = true
      })
      .addCase(addRoster.fulfilled, (state) => {
        state.block_data = false
      })
  }
})

export default appClientRostersSlice.reducer
