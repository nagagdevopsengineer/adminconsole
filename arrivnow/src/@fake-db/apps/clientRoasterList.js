import mock from '../mock'

// ** Utils
import { paginateArray } from '../utils'

const data = {
    client_rosters: [
    {
      id: 1,
      start_end_date: '17/01/2022',
      start_time: '07:00 AM',
      busno: 'DL45123 - RED',
      route: 'Samsung manesar to noida',
      status: 'inactive'
    },
    {
      id: 2,
      start_end_date: '17/01/2022',
      start_time: '09:00 AM',
      busno: 'DL451234 - White',
      route: 'Samsung manesar to gurgaon',
      status: 'active'
    },
    {
      id: 3,
      start_end_date: '17/01/2022',
      start_time: '11:00 AM',
      busno: 'DL451235 - Blue',
      route: 'Samsung manesar to delhi',
      status: 'inactive'
    }
  ]
}


// GET ALL DATA
mock.onGet('/api/client_roster/list/all-data').reply(200, data.client_rosters)

// POST: Add new user
mock.onPost('/apps/client_roster/add-roster').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data)
  console.log(user)
  const highestValue = data.client_rosters.reduce((a, b) => (a.id > b.id ? a : b)).id

  user.id = highestValue + 1

  data.client_rosters.push(user)

  return [201, { user }]
})

// GET Updated DATA
mock.onGet('/api/client_roster/list/data').reply(config => {
  
  const {
    s_date = null,
    route = '',
    busno = '',
    q = '',
    page = 1,
    perPage = 10,
    sort = 'asc',
    status = null,
    start_time = null,
    sortColumn = 'date'
  } = config
  /* eslint-disable  */
  
  const queryLowered = q.toLowerCase() ?? null
 
  const routeLower = route.toLowerCase() ?? null
  const busLower = busno.toLowerCase() ?? null
  const dataAsc = data.client_rosters.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))
  
  const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()
  
  const filteredData = dataToFilter.filter(user => 
   
    q ? 
      ( 
        (user.route.toLowerCase().includes(queryLowered) ||
        user.busno.toLowerCase().includes(queryLowered)) &&
        user.status.toLowerCase() === (status || user.status.toLowerCase()))
      :(
        user.start_end_date ===  (s_date || user.start_end_date) &&
        user.start_time ===  (start_time || user.start_time) &&
        user.route.toLowerCase().includes(routeLower) &&
        user.busno.toLowerCase().includes(busLower) &&
        user.status.toLowerCase() === (status || user.status.toLowerCase())
      )
  )
 
  /* eslint-enable  */
      
  return [
    200,
    {
      total: filteredData.length,
      client_rosters: paginateArray(filteredData, perPage, page)
    }
  ]
})

// GET USER
mock.onGet('/api/client_roster/roster').reply(config => {
  const { id } = config
  const client_roster = data.client_rosters.find(i => i.id === id)
  return [200, { client_roster }]
})

// DELETE: Deletes User
mock.onDelete('/apps/client_roster/delete').reply(config => {
  // Get route id from URL
  let userId = config.id

  // Convert Id to number
  userId = Number(userId)

  const userIndex = data.client_rosters.findIndex(t => t.id === userId)
  data.client_rosters.splice(userIndex, 1)

  return [200]
})
