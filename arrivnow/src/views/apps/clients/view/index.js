// ** React Imports
import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { getClient } from '../store'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'

// ** User View Components
import UserInfoCard from './UserInfoCard'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UserView = () => {
  // ** Store Vars
  const store = useSelector(state => state.clients)
  const dispatch = useDispatch()

  // ** Hooks
  const { id } = useParams()

  // ** Get suer on mount
  useEffect(() => {
    dispatch(getClient(id))
  }, [dispatch])

  //const [active, setActive] = useState('1')

  /* const toggleTab = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  } */

  return store.selectedClient !== null && store.selectedClient !== undefined ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='12' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
         <UserInfoCard selectedUser={store.selectedClient} />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>User not found</h4>
      <div className='alert-body'>
        User with id: {id} doesn't exist. Check list of all Users: <Link to='/apps/clients/list'>Clients List</Link>
      </div>
    </Alert>
  )
}
export default UserView
