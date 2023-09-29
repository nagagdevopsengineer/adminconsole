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

export const getAllData = createAsyncThunk('addEmployees/getAllData', async () => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/employees/?populate=*&sort=createdAt:DESC`)
    return response.data.data
  } else {
    const c_uuid = localStorage.getItem('client_uuid')
    const response = await axiosObj.get(`/api/employees/?filters[client][id]=${c_uuid}&populate=*&sort=createdAt:DESC`)
    return response.data.data
  }
})

export const getData = createAsyncThunk('addEmployees/getData', async params => {
  const user_data = JSON.parse(localStorage.getItem('userData'))
  if (user_data.role === 'admin') {
    const response = await axiosObj.get(`/api/employees/?populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  } else {
    const c_uuid = localStorage.getItem('client_uuid')
    const response = await axiosObj.get(`/api/employees/?filters[client][id]=${c_uuid}&populate=*&sort=${params.sortColumn}:${params.sort}&pagination[page]=${params.page}&pagination[pageSize]=${params.perPage}`)
    return {
      params,
      data: response.data.data,
      totalPages: response.data.meta.pagination.total
    }
  }
  
})

export const getEmployee = createAsyncThunk('addEmployees/getEmployee', async id => {
  const response = await axiosObj.get(`/api/employees/${id}/?populate=*`)
  return response.data.data
})

export const addEmployee = createAsyncThunk('addEmployees/addEmployee', async (employee, { dispatch, getState }) => {
  try {
      let avatar_image_id = ''
      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }

      if (employee.photo) {
        const formData = new FormData()
        formData.append('files', employee.photo)
        const response = await axiosObj.post('/api/upload', formData, config)
        avatar_image_id = response.data[0].id
      }
      employee.photo = avatar_image_id
      await axiosObj.post('/api/employees', {data: employee}).then(() => {
      handleClickMsg('Done!', 'Employee has been added successfully.', 'success')
      dispatch(getData(getState().employees.params))
      return employee
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const updateEmployee = createAsyncThunk('addEmployees/updateEmployee', async (employee, { dispatch, getState }) => {
  try {
      let avatar_image_id = ''
      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }

      if (employee.data.photo) {
        const formData = new FormData()
        formData.append('files', employee.data.photo)
        const response = await axiosObj.post('/api/upload', formData, config)
        avatar_image_id = response.data[0].id
      }
      if (avatar_image_id) {
        employee.data.photo = avatar_image_id
      } else {
        delete employee.data.photo
      }
      await axiosObj.put(`/api/employees/${employee.id}`, employee).then(() => {
      handleClickMsg('Done!', 'Employee has been updated successfully.', 'success')
      dispatch(getEmployee(employee.id))
      dispatch(getData(getState().employees.params))
      return employee
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const deleteEmployee = createAsyncThunk('addEmployees/deleteEmployee', async (id, { dispatch, getState }) => {
  try {
    await axiosObj.delete(`/api/employees/${id}`).then(() => {
      handleClickMsg('Done!', 'Employee has been deleted successfully.', 'success')
      dispatch(getData(getState().employees.params))
      return id
    })
  } catch (err) {
    handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
  }
})

export const addEmployeesSlice = createSlice({
  name: 'addEmployees',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    block_data: false,
    selectedEmployee: null
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
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.selectedEmployee = action.payload
      })
      .addCase(addEmployee.pending, (state) => {
        state.block_data = true
      })
      .addCase(addEmployee.fulfilled, (state) => {
        state.block_data = false
      })
      .addCase(updateEmployee.pending, (state) => {
        state.block_data = true
      })
      .addCase(updateEmployee.fulfilled, (state) => {
        state.block_data = false
      })
  }
})

export default addEmployeesSlice.reducer
