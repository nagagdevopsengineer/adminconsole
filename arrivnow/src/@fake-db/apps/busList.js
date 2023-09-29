import mock from '../mock'

// ** Utils
import { paginateArray } from '../utils'

const data = {
  buses: [
    {
      id: 1,
      role: 'editor',
      vehicle_number: 'ASD789456',
      vehicle_type: 'bus',
      rc: '',
      pollution: '',
      bus_insurance: '',
      any_police_complaint: '',
      any_major_accident: '',
      bus_capacity: '50',
      is_ac: 'Non Ac',
      seating_arrangement: '',
      is_cctv_available: 'No',
      allocate_route: 'Samsung manesar to gurgaon',
      status: 'inactive'
    },
    {
      id: 2,
      role: 'author',
      vehicle_number: 'ASD7898888',
      vehicle_type: 'bus',
      rc: '',
      pollution: '',
      bus_insurance: '',
      any_police_complaint: '',
      any_major_accident: '',
      bus_capacity: '50',
      is_ac: 'Ac',
      seating_arrangement: '',
      is_cctv_available: 'No',
      allocate_route: 'Samsung gurgaon to faridabaad',
      status: 'active'
    },
    {
      id: 3,
      role: 'author',
      vehicle_number: 'ASD7898888',
      vehicle_type: 'bus',
      rc: '',
      pollution: '',
      bus_insurance: '',
      any_police_complaint: '',
      any_major_accident: '',
      bus_capacity: '50',
      is_ac: 'Ac',
      seating_arrangement: '',
      is_cctv_available: 'No',
      allocate_route: 'Samsung gurgaon to faridabaad',
      status: 'active'
    }
  ]
}


// GET ALL DATA
mock.onGet('/api/buses/list/all-data').reply(200, data.buses)

// POST: Add new user
mock.onPost('/apps/buses/add-bus').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data)
  const highestValue = data.buses.reduce((a, b) => (a.id > b.id ? a : b)).id

  user.id = highestValue + 1

  data.buses.push(user)

  return [201, { user }]
})

// GET Updated DATA
mock.onGet('/api/buses/list/data').reply(config => {
  const {
    q = '',
    page = 1,
    role = null,
    perPage = 10,
    sort = 'asc',
    status = null,
    vehicle_number = null,
    bus_capacity = null,
    allocate_route = null,
    sortColumn = 'vehicle_number'
  } = config

  /* eslint-disable  */
  const queryLowered = q.toLowerCase()
  const vnLowerd = vehicle_number.toLowerCase()
  const routeLowerd = allocate_route.toLowerCase()

  const dataAsc = data.buses.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))

  const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()

  const filteredData = dataToFilter.filter(
    user =>
      user.role === (role || user.role) &&
      user.status === (status || user.status)&&
      user.vehicle_number.toLocaleLowerCase().includes(vnLowerd) &&
      user.bus_capacity === (bus_capacity || user.bus_capacity)&&
      user.allocate_route.toLocaleLowerCase().includes(routeLowerd)
  )
  /* eslint-enable  */

  return [
    200,
    {
      total: filteredData.length,
      buses: paginateArray(filteredData, perPage, page)
    }
  ]
})

// GET USER
mock.onGet('/api/buses/bus').reply(config => {
  const { id } = config
  const bus = data.buses.find(i => i.id === id)
  return [200, { bus }]
})

// DELETE: Deletes User
mock.onDelete('/apps/buses/delete').reply(config => {
  // Get bus id from URL
  let userId = config.id

  // Convert Id to number
  userId = Number(userId)

  const userIndex = data.buses.findIndex(t => t.id === userId)
  data.buses.splice(userIndex, 1)

  return [200]
})
