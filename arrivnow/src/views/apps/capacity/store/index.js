// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Axios Imports
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

export const getAllData = createAsyncThunk('appRouteChanges/getAllData', async () => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/routechanges/?populate=*`)
    return response.data.data
  } else {
    const c_uuid = localStorage.getItem('client_uuid')
    const response = await axiosObj.get(`/api/routechanges/?filters[employee][client][id]=${c_uuid}&populate=*`)
    return response.data.data
  }
    
})

export const updateRouteChange = createAsyncThunk('appRouteChanges/updateRouteChange', async (route_change, { dispatch }) => {
  try {
      await axiosObj.put(`/api/routechanges/${route_change.id}`, route_change).then(() => {
      handleClickMsg('Done!', 'Route Change has been updated successfully.', 'success')
      dispatch(getAllData())
      return route_change
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const appRouteChangesSlice = createSlice({
  name: 'appRouteChanges',
  initialState: {
    data: [],
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllData.fulfilled, (state, action) => {
        state.allData = action.payload
      })
  }
})

export default appRouteChangesSlice.reducer
