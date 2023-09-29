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

export const getAllData = createAsyncThunk('appRoutes/getAllData', async () => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/routes/?populate=*&sort=createdAt:DESC`)
    return response.data.data
  } else {
    const c_uuid = localStorage.getItem('client_uuid')
    const response = await axiosObj.get(`/api/routes/?filters[client][id]=${c_uuid}&populate=*&sort=createdAt:DESC`)
    return response.data.data
  }
})

export const getData = createAsyncThunk('appRoutes/getData', async params => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/routes/?populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  } else {
    const c_uuid = localStorage.getItem('client_uuid')
    const response = await axiosObj.get(`/api/routes/?filters[client][id]=${c_uuid}&populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  }
})

export const getRoute = createAsyncThunk('appRoutes/getRoute', async id => {
  const response = await axiosObj.get(`/api/stops/?filters[route][id]=${id}&sort=order:ASC`)
  const stop_data = response.data.data
  const stop_list = {
      starting_point: '',
      ending_point: '',
      waypoint_data: [],
      marker_data: []
  }
  if (stop_data) {
    stop_data.map((stop, index) => {
      if (index === 0) {
        stop_list.starting_point = stop.attributes
        stop_list.marker_data = stop.attributes
      } else if (index === (stop_data.length - 1)) {
        stop_list.ending_point = stop.attributes
      } else {
       // stop_list.waypoint_data.push({location: stop.attributes})
       stop_list.waypoint_data.push({location: {lat: stop.attributes.latitude, lng: stop.attributes.longitude}})
      }
    })
  }
  console.log(stop_list)
  return stop_list
})

export const addRoute = createAsyncThunk('appRoutes/addRoute', async (route, { dispatch, getState }) => {
  try {
    const response = await axiosObj.post('/api/routes', {data: {name: route.name, client: route.client}})
    const route_id = response.data.data.id
    let s_counter = 0
    const [... responses] = await Promise.all(
      route.stops.map((stop) => { 
        s_counter += 1
        axiosObj.post('/api/stops', {data: {order: s_counter, name: stop.data.label, longitude: stop.data.lng, latitude: stop.data.lat, route: route_id}})
      })
    )
     
   /* const s_len = route.stops.length
    const stop = route.stops[0]
    const stops_data = route.stops
    let r_counter = 1
    const s_response = await axiosObj.post('/api/stops', {data: {name: stop.data.label, longitude: stop.data.lng, latitude: stop.data.lat, route: route_id}})
    while (r_counter < s_len) {
      if (s_response) {
        const n_stop = stops_data[r_counter]
        if (n_stop === undefined || n_stop === '') {
          r_counter = r_counter + 1
          continue
        }
        //s_response = ''
        s_response = await axiosObj.post('/api/stops', {data: {name: n_stop.data.label, longitude: n_stop.data.lng, latitude: n_stop.data.lat, route: route_id}})
        r_counter = r_counter + 1
      }
    } */ 

    if (responses) {
      handleClickMsg('Done!', 'Route has been added successfully.', 'success')
      dispatch(getData(getState().routes.params))
      return route 
    }
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const deleteRoute = createAsyncThunk('appRoutes/deleteRoute', async (id, { dispatch, getState }) => {
  try {
    await axiosObj.delete(`/api/routes/${id}`).then(() => {
    handleClickMsg('Done!', 'Route has been deleted successfully.', 'success')
    dispatch(getData(getState().routes.params))
    return id
  })
} catch (err) {
  handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
}
})


export const appRoutesSlice = createSlice({
  name: 'appRoutes',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    stops: [],
    block_data: false,
    selectedRoute: null
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
      .addCase(getRoute.fulfilled, (state, action) => {
        state.selectedRoute = action.payload
      })
      .addCase(addRoute.pending, (state) => {
        state.block_data = true
      })
      .addCase(addRoute.fulfilled, (state) => {
        state.block_data = false
      })
  }
})

export default appRoutesSlice.reducer
