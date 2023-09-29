import mock from '../mock'

// ** Utils
import { paginateArray } from '../utils'

const data = {
  employees: [
    {
      id: 1,
      fullName: 'Galen Slixby',
      role: 'editor',
      country: 'El Salvador',
      contact: '(479) 232-9151',
      email: 'gslixby0@abc.net.au',
      status: 'inactive',
      vaccine_certificate: '',
      start_point: '',
      end_point: '',
      allocate_route: '',
      bus_no: '',
      avatar: ''
    },
    {
      id: 2,
      fullName: 'Halsey Redmore',
      role: 'author',
      country: 'Albania',
      contact: '(472) 607-9137',
      email: 'hredmore1@imgur.com',
      status: 'pending',
      vaccine_certificate: '',
      start_point: '',
      end_point: '',
      allocate_route: '',
      bus_no: '',
      avatar: require('@src/assets/images/avatars/10.png').default
    },
    {
      id: 3,
      fullName: 'Halsey Redmore',
      role: 'author',
      country: 'Albania',
      contact: '(472) 607-9137',
      email: 'hredmore1@imgur.com',
      status: 'pending',
      vaccine_certificate: '',
      start_point: '',
      end_point: '',
      allocate_route: '',
      bus_no: '',
      avatar: require('@src/assets/images/avatars/10.png').default
    }
  ]
}


// GET ALL DATA
mock.onGet('/api/employees/list/all-data').reply(200, data.employees)

// POST: Add new user
mock.onPost('/apps/employees/add-employee').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data)
  const highestValue = data.employees.reduce((a, b) => (a.id > b.id ? a : b)).id

  user.id = highestValue + 1

  data.employees.push(user)

  return [201, { user }]
})

// GET Updated DATA
mock.onGet('/api/employees/list/data').reply(config => {
  const {
    q = '',
    page = 1,
    role = null,
    perPage = 10,
    sort = 'asc',
    status = null,
    s_name = null,
    s_email = null,
    s_phone = null,
    
    sortColumn = 'fullName'
  } = config

  /* eslint-disable  */
  const queryLowered = q.toLowerCase() ?? s_name.toLowerCase()

  const emailLowered = s_email.toLowerCase()
 

  const dataAsc = data.employees.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))

  const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()

  const filteredData = dataToFilter.filter(
    user =>
      user.fullName.toLowerCase().includes(queryLowered) &&
      user.email.toLowerCase().includes(emailLowered) &&
      user.role === (role || user.role) &&
      user.status.toLowerCase() === (status || user.status.toLowerCase()) &&
      user.contact.toLowerCase().includes(s_phone)
  )
  /* eslint-enable  */

  return [
    200,
    {
      total: filteredData.length,
      employees: paginateArray(filteredData, perPage, page)
    }
  ]
})

// GET USER
mock.onGet('/api/employees/employee').reply(config => {
  const { id } = config
  const employee = data.employees.find(i => i.id === id)
  return [200, { employee }]
})

// DELETE: Deletes User
mock.onDelete('/apps/employees/delete').reply(config => {
  // Get employee id from URL
  let userId = config.id

  // Convert Id to number
  userId = Number(userId)

  const userIndex = data.employees.findIndex(t => t.id === userId)
  data.employees.splice(userIndex, 1)

  return [200]
})
