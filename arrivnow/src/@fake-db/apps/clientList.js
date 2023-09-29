import mock from '../mock'

// ** Utils
import { paginateArray } from '../utils'

const data = {
  clients: [
    {
      id: 1,
      billing: 'Manual - Credit Card',
      fullName: 'Galen Slixby',
      company: 'Yotz PVT LTD',
      role: 'editor',
      username: 'gslixby0',
      country: 'El Salvador',
      contact: '(479) 232-9151',
      email: 'gslixby0@abc.net.au',
      currentPlan: 'enterprise',
      status: 'inactive',
      registeration_no:'ABC123',
      pancard_number:'ANC789',
      gst_number:'ABC987',
      avatar: ''
    },
    {
      id: 2,
      billing: 'Manual - Paypal',
      fullName: 'Halsey Redmore',
      company: 'Skinder PVT LTD',
      role: 'author',
      username: 'hredmore1',
      country: 'Albania',
      contact: '(472) 607-9137',
      email: 'hredmore1@imgur.com',
      currentPlan: 'team',
      status: 'pending',
      registeration_no:'ABC123',
      pancard_number:'ANC789',
      gst_number:'ABC987',
      avatar: require('@src/assets/images/avatars/10.png').default
    },
    {
      id: 3,
      billing: 'Manual - Paypal',
      fullName: 'Harish',
      company: 'Harry PVT LTD',
      role: 'author',
      username: 'hredmore1',
      country: 'Albania',
      contact: '9874561230',
      email: 'harry@gmail.com.com',
      currentPlan: 'team',
      status: 'pending',
      registeration_no:'ABC123',
      pancard_number:'ANC789',
      gst_number:'ABC987',
      avatar: require('@src/assets/images/avatars/10.png').default
    }
  ]
}


// GET ALL DATA
mock.onGet('/api/clients/list/all-data').reply(200, data.clients)

// POST: Add new user
mock.onPost('/apps/clients/add-client').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data)
  const highestValue = data.clients.reduce((a, b) => (a.id > b.id ? a : b)).id

  user.id = highestValue + 1

  data.clients.push(user)

  return [201, { user }]
})

// GET Updated DATA
mock.onGet('/api/clients/list/data').reply(config => {
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
    currentPlan = null,
    sortColumn = 'fullName'
  } = config

  /* eslint-disable  */
  const queryLowered = q.toLowerCase()
  const emailLowered = s_email.toLowerCase()
  const nameLowered = s_name.toLowerCase()

  const dataAsc = data.clients.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))

  const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()

  const filteredData = dataToFilter.filter(user =>
    q ? 
    (( user.email.toLowerCase().includes(queryLowered) ||
        user.fullName.toLowerCase().includes(queryLowered) ||
        user.billing.toLowerCase().includes(queryLowered)) &&
      user.role === (role || user.role) &&
      user.currentPlan === (currentPlan || user.currentPlan) &&
      user.status === (status || user.status))
    :
    user.fullName.toLowerCase().includes(nameLowered) &&
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
      clients: paginateArray(filteredData, perPage, page)
    }
  ]
})

// GET USER
mock.onGet('/api/clients/client').reply(config => {
  const { id } = config
  const client = data.clients.find(i => i.id === id)
  return [200, { client }]
})

// DELETE: Deletes User
mock.onDelete('/apps/clients/delete').reply(config => {
  // Get client id from URL
  let userId = config.id

  // Convert Id to number
  userId = Number(userId)

  const userIndex = data.clients.findIndex(t => t.id === userId)
  data.clients.splice(userIndex, 1)

  return [200]
})
