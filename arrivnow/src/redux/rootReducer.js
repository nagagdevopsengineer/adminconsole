// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import todo from '@src/views/apps/todo/store'
import chat from '@src/views/apps/chat/store'
import users from '@src/views/apps/user/store'
import clients from '@src/views/apps/clients/store'
import contractors from '@src/views/apps/contractors/store'
import drivers from '@src/views/apps/drivers/store'
import helpers from '@src/views/apps/helpers/store'
import buses from '@src/views/apps/buses/store'
import routes from '@src/views/apps/routes/store'
import rosters from '@src/views/apps/roster/store'
import client_rosters from '@src/views/apps/roster/store/client.js'
import employees from '@src/views/apps/employees/store'
import email from '@src/views/apps/email/store'
import invoice from '@src/views/apps/invoice/store'
import calendar from '@src/views/apps/calendar/store'
import ecommerce from '@src/views/apps/ecommerce/store'
import dataTables from '@src/views/tables/data-tables/store'
import permissions from '@src/views/apps/roles-permissions/store'
import routechanges from '@src/views/apps/capacity/store'

const rootReducer = {
  auth,
  todo,
  chat,
  email,
  users,
  clients,
  navbar,
  layout,
  invoice,
  calendar,
  ecommerce,
  dataTables,
  permissions,
  contractors,
  drivers,
  helpers,
  buses,
  routes,
  employees,
  rosters,
  client_rosters,
  routechanges
}

export default rootReducer
