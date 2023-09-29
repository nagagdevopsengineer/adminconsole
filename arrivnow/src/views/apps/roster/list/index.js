// ** User List Component
import Table from './Table'
import ClientTable from './ClientTable'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

// ** Styles
import '@styles/react/apps/app-users.scss'

const RostersList = () => {
  const userData = JSON.parse(localStorage.getItem('userData'))
  return userData.role === 'contractor' ? (
    <div className='app-roster-list'>
      <Table />
    </div>
  ) : (
    <div className='app-roster-list'>
      <ClientTable />
    </div>
  )
}

export default RostersList
