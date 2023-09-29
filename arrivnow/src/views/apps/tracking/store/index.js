// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getAllData = createAsyncThunk('appDrivers/getAllData', async () => {
  const response = await axios.get('/api/drivers/list/all-data')
  return response.data
})

export const getData = createAsyncThunk('appDrivers/getData', async params => {
  const response = await axios.get('/api/drivers/list/data', params)
  return {
    params,
    data: response.data.drivers,
    totalPages: response.data.total
  }
})

export const getDriver = createAsyncThunk('appDrivers/getDriver', async id => {
  const response = await axios.get('/api/drivers/driver', { id })
  return response.data.driver
})

export const addDriver = createAsyncThunk('appDrivers/addDriver', async (driver, { dispatch, getState }) => {
  await axios.post('/apps/drivers/add-driver', driver)
  await dispatch(getData(getState().drivers.params))
  await dispatch(getAllData())
  return driver
})

export const deleteDriver = createAsyncThunk('appDrivers/deleteDriver', async (id, { dispatch, getState }) => {
  await axios.delete('/apps/drivers/delete', { id })
  await dispatch(getData(getState().drivers.params))
  await dispatch(getAllData())
  return id
})

export const appDriversSlice = createSlice({
  name: 'appDrivers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
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
  }
})

export default appDriversSlice.reducer
