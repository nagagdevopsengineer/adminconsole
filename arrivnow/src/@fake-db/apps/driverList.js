import mock from '../mock'

// ** Utils
import { paginateArray } from '../utils'

const data = {
  drivers: [
    {
      id: 1,
      fullName: 'Galen Slixby',
      role: 'editor',
      status: 'inactive',
      aadhar_card: '', 
      vaccine_certificate: '', 
      police_verification_doc: '', 
      driving_license: '',
      avatar: ''
    },
    {
      id: 2,
      fullName: 'john Slixby',
      role: 'editor',
      status: 'Active',
      aadhar_card: '', 
      vaccine_certificate: '', 
      police_verification_doc: '', 
      driving_license: '',
      avatar: ''
    },
    {
      id: 3,
      fullName: 'john Slixby',
      role: 'editor',
      status: 'Active',
      aadhar_card: '', 
      vaccine_certificate: '', 
      police_verification_doc: '', 
      driving_license: '',
      avatar: ''
    }
  ]
}


// GET ALL DATA
mock.onGet('/api/drivers/list/all-data').reply(200, data.drivers)

// POST: Add new user
mock.onPost('/apps/drivers/add-driver').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data)
  const highestValue = data.drivers.reduce((a, b) => (a.id > b.id ? a : b)).id

  user.id = highestValue + 1

  data.drivers.push(user)

  return [201, { user }]
})

// GET Updated DATA
mock.onGet('/api/drivers/list/data').reply(config => {
  const {
    q = '',
    page = 1,
    role = null,
    perPage = 10,
    sort = 'asc',
    status = null,
    currentPlan = null,
    sortColumn = 'fullName'
  } = config

  /* eslint-disable  */
  const queryLowered = q.toLowerCase()

  const dataAsc = data.drivers.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))

  const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()

  const filteredData = dataToFilter.filter(
    user =>
      (user.fullName.toLowerCase().includes(queryLowered)) &&
      user.role === (role || user.role) &&
      user.currentPlan === (currentPlan || user.currentPlan) &&
      user.status.toLowerCase() === (status || user.status.toLowerCase())
  )
  /* eslint-enable  */

  return [
    200,
    {
      total: filteredData.length,
      drivers: paginateArray(filteredData, perPage, page)
    }
  ]
})

// GET USER
mock.onGet('/api/drivers/driver').reply(config => {
  const { id } = config
  const driver = data.drivers.find(i => i.id === id)
  return [200, { driver }]
})

// DELETE: Deletes User
mock.onDelete('/apps/drivers/delete').reply(config => {
  // Get driver id from URL
  let userId = config.id

  // Convert Id to number
  userId = Number(userId)

  const userIndex = data.drivers.findIndex(t => t.id === userId)
  data.drivers.splice(userIndex, 1)

  return [200]
})
