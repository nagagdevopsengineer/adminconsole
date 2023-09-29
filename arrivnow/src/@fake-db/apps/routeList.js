import mock from '../mock'

// ** Utils
import { paginateArray } from '../utils'

const data = {
  routes: [
    {
      id: 1,
      route_name: 'Samsung gurgaon to faridabaad',
      starting_point: 'Samsung gurgaon',
      starting_point_code: 'F65C4D',
      role: 'editor',
      ending_point: 'Samsung faridabaad',
      ending_point_code: '1T182A',
      status: 'inactive',
      waypoint_data: [
        {
          location: "JMD Megapolis IT Park, Sector 48, Gurugram, Haryana, 122018"
        },
        {
          location: "Rashtrapati Bhavan, Presidents Estate Road, New Delhi, Delhi, 110004"
        }
      ]
    },
    {
      id: 2,
      route_name: 'Samsung gurgaon to faridabaad',
      starting_point: 'Samsung gurgaon',
      starting_point_code: 'F65C4D',
      role: 'editor',
      ending_point: 'Samsung faridabaad',
      ending_point_code: '1T182A',
      status: 'inactive',
      waypoint_data: [
        {
          location: "JMD Megapolis IT Park, Sector 48, Gurugram, Haryana, 122018"
        },
        {
          location: "Rashtrapati Bhavan, Presidents Estate Road, New Delhi, Delhi, 110004"
        }
      ]
    },
    {
      id: 3,
      route_name: 'Samsung manesar to gurgaon',
      starting_point: 'Samsung manesar',
      starting_point_code: 'F65C4D',
      role: 'author',
      ending_point: 'Samsung gurgaon',
      ending_point_code: '1T182A',
      status: 'pending',
      waypoint_data: [
        {
          location: "JMD Megapolis IT Park, Sector 48, Gurugram, Haryana, 122018"
        },
        {
          location: "Rashtrapati Bhavan, Presidents Estate Road, New Delhi, Delhi, 110004"
        }
      ]
    }
  ]
}


// GET ALL DATA
mock.onGet('/api/routes/list/all-data').reply(200, data.routes)

// POST: Add new user
mock.onPost('/apps/routes/add-route').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data)
  const highestValue = data.routes.reduce((a, b) => (a.id > b.id ? a : b)).id

  user.id = highestValue + 1

  data.routes.push(user)

  return [201, { user }]
})

// GET Updated DATA
mock.onGet('/api/routes/list/data').reply(config => {
  
  const {
    q = '',
    page = 1,
    role = null,
    perPage = 10,
    sort = 'asc',
    status = null,
    ending_point = null,
    starting_point = null,
    route_name = null,
    sortColumn = 'route_name'
  } = config
 
  /* eslint-disable  */
  // const queryLowered = q.toLowerCase()
  const routeNameLowered = route_name.toLowerCase()
  const starting_pointLowered = starting_point.toLowerCase()
  const ending_pointLowered = ending_point.toLowerCase()

  const dataAsc = data.routes.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))

  const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()
  
  const filteredData = dataToFilter.filter(user =>
    q ? 
    ( 
      user.route_name.toLowerCase().includes(routeNameLowered) ||
      user.starting_point.toLowerCase().includes(starting_pointLowered)) &&
      user.ending_point.toLowerCase().includes(ending_pointLowered) &&
       user.status.toLowerCase() === (status || user.status.toLowerCase())
    :
   
      (user.route_name.toLowerCase().includes(routeNameLowered)) &&
      user.role === (role || user.role) &&
      user.status.toLowerCase() === (status || user.status.toLowerCase())&&
      user.starting_point.toLowerCase() === (starting_point || user.starting_point.toLowerCase())&&
      user.ending_point.toLowerCase() === (ending_point || user.ending_point.toLowerCase())
  )
  /* eslint-enable  */

  return [
    200,
    {
      total: filteredData.length,
      routes: paginateArray(filteredData, perPage, page)
    }
  ]
})

// GET USER
mock.onGet('/api/routes/route').reply(config => {
  const { id } = config
  const route = data.routes.find(i => i.id === id)
  return [200, { route }]
})

// DELETE: Deletes User
mock.onDelete('/apps/routes/delete').reply(config => {
  // Get route id from URL
  let userId = config.id

  // Convert Id to number
  userId = Number(userId)

  const userIndex = data.routes.findIndex(t => t.id === userId)
  data.routes.splice(userIndex, 1)

  return [200]
})
