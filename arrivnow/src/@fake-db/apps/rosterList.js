import mock from '../mock'

// ** Utils
import { paginateArray } from '../utils'

const data = {
  rosters: [
    {
      id: 1,
      start_end_date: '17/01/2022',
      starting_point: '17/01/2022 ',
      start_time: '07:00 AM',
      end_time: '09:00 AM',
      busno: '111',      
      drivername: 'Rajesh',
      helpername: 'Rahul',
      status: 'inactive'
      
    },
    {
      id: 2,
      start_time: '09:00 AM',
      end_time: '11:00 AM',
      starting_point: '17/02/2022',
      start_end_date: '17/01/2022',
      drivername: 'Amit',
      helpername: 'Sohan',
      status: 'inactive',
      busno: '123'
    },
    {
      id: 3,
      start_time: '11:00 AM',
      end_time: '01:00 PM',
      start_end_date: '17/01/2022',
      starting_point: '17/02/2022 ',
      drivername: 'ram',
      helpername: 'Popp',
      status: 'inactive',
     busno: '1239'
      
     
    }
  ]
}


// GET ALL DATA
mock.onGet('/api/roster/list/all-data').reply(200, data.rosters)

// POST: Add new user
mock.onPost('/apps/roster/add-roster').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data)
  
  const highestValue = data.rosters.reduce((a, b) => (a.id > b.id ? a : b)).id

  user.id = highestValue + 1

  data.rosters.push(user)

  return [201, { user }]
})

// GET Updated DATA
mock.onGet('/api/roster/list/data').reply(config => {
  const {
    drivername = null,
    starting_point = null,
    helpername = null,
    busno = null,
    start_time = null,

    q = '',
    page = 1,
   
    perPage = 10,
    sort = 'asc',
    status = null,
    sortColumn = 'drivername'
  } = config
   console.log(starting_point, 'startingpoint')
  /* eslint-disable  */
  const queryLowered = q.toLowerCase()
  const drivernameLowered = drivername.toLowerCase()
  const helpernameLowered = helpername.toLowerCase()
  

  const dataAsc = data.rosters.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))

  const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()
  console.log(dataToFilter,'filter')
  const filteredData = dataToFilter.filter(user => 
   
    q ? 
      ( 
        user.drivername.toLowerCase().includes(queryLowered) ||
        user.helpername.toLowerCase().includes(queryLowered)) &&
     
      user.status.toLowerCase() === (status || user.status.toLowerCase())
      :
      user.drivername.toLowerCase().includes(drivernameLowered) &&
      user.helpername.toLowerCase().includes(helpernameLowered) &&
      user.busno.toLowerCase().includes(busno) &&
      // user.starting_point.toLowerCase().includes(starting_point) &&
      user.start_end_date ===  (starting_point || user.start_end_date) &&
      user.start_time ===  (start_time || user.start_time) &&
      user.status.toLowerCase() === (status || user.status.toLowerCase())
  )
 
  /* eslint-enable  */

  return [
    200,
    {
      total: filteredData.length,
 rosters: paginateArray(filteredData, perPage, page)
    }
  ]
})

// GET USER
mock.onGet('/api/rosters/roster').reply(config => {
  const { id } = config
  const roster = data.rosters.find(i => i.id === id)
  return [200, { roster }]
})

// DELETE: Deletes User
mock.onDelete('/apps/rosters/delete').reply(config => {
  // Get route id from URL
  let userId = config.id

  // Convert Id to number
  userId = Number(userId)

  const userIndex = data.rosters.findIndex(t => t.id === userId)
  data.rosters.splice(userIndex, 1)

  return [200]
})
