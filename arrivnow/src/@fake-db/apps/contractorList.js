  import mock from '../mock'

// ** Utils
import { paginateArray } from '../utils'

const data = {
  contractors: [
    {
      id: 1,
      fullName: 'Galen Slixby',
      company: 'Yotz PVT LTD',
      role: 'editor',
      contact: '(479) 232-9151',
      email: 'gslixby0@abc.net.au',
      status: 'inactive',
      gst_no:'ABC987',
      avatar: '',
      number_of_buses: 5,
      any_bus_complaint: '',
      any_defect: '',
      any_police_complaint: ''
    },
    {
      id: 2,
      fullName: 'Halsey Redmore',
      company: 'Skinder PVT LTD',
      role: 'author',
      contact: '(472) 607-9137',
      email: 'hredmore1@imgur.com',
      status: 'pending',
      gst_no:'ABC987',
      avatar: require('@src/assets/images/avatars/10.png').default,
      number_of_buses: 2,
      any_bus_complaint: '',
      any_defect: '',
      any_police_complaint: ''
    },
    {
      id: 3,
      fullName: 'Halsey Redmore',
      company: 'Skinder PVT LTD',
      role: 'author',
      contact: '(472) 607-9137',
      email: 'hredmore1@imgur.com',
      status: 'pending',
      gst_no:'ABC987',
      avatar: require('@src/assets/images/avatars/10.png').default,
      number_of_buses: 2,
      any_bus_complaint: '',
      any_defect: '',
      any_police_complaint: ''
    }
  ]
}


// GET ALL DATA
mock.onGet('/api/contractors/list/all-data').reply(200, data.contractors)

// POST: Add new user
mock.onPost('/apps/contractors/add-contractor').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data)
  const highestValue = data.contractors.reduce((a, b) => (a.id > b.id ? a : b)).id

  user.id = highestValue + 1

  data.contractors.push(user)

  return [201, { user }]
})

// GET Updated DATA
mock.onGet('/api/contractors/list/data').reply(config => {
  const {
    q = '',
    s_name = null,
    s_email = null,
    s_phone = null,
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
  const nameLowered = s_name.toLowerCase()
  const emailLowered = s_email.toLowerCase()

  const dataAsc = data.contractors.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))

  const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()

  const filteredData = dataToFilter.filter(user =>
    q ? 
      (user.email.toLowerCase().includes(queryLowered) ||
        user.fullName.toLowerCase().includes(queryLowered) ||
        user.contact.toLowerCase().includes(queryLowered)) &&
      user.role === (role || user.role) &&
      user.currentPlan === (currentPlan || user.currentPlan) &&
      user.status.toLowerCase() === (status || user.status.toLowerCase())
      :
      user.email.toLowerCase().includes(emailLowered) &&
      user.fullName.toLowerCase().includes(nameLowered) &&
      user.contact.toLowerCase().includes(s_phone) &&
      user.status.toLowerCase() === (status || user.status.toLowerCase())
  )
  /* eslint-enable  */

  return [
    200,
    {
      total: filteredData.length,
      contractors: paginateArray(filteredData, perPage, page)
    }
  ]
})

// GET USER
mock.onGet('/api/contractors/contractor').reply(config => {
  const { id } = config
  const contractor = data.contractors.find(i => i.id === id)
  return [200, { contractor }]
})

// DELETE: Deletes User
mock.onDelete('/apps/contractors/delete').reply(config => {
  // Get client id from URL
  let userId = config.id

  // Convert Id to number
  userId = Number(userId)

  const userIndex = data.contractors.findIndex(t => t.id === userId)
  data.contractors.splice(userIndex, 1)

  return [200]
})
