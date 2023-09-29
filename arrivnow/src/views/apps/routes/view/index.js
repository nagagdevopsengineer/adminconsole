// ** React Imports
import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { getRoute } from '../store'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'

// ** User View Components
import CustomMap from "@src/views/components/google-map/direction.js"

// ** Styles
import '@styles/react/apps/app-users.scss'

const UserView = () => {
  // ** Store Vars
  const store = useSelector(state => state.routes)
  const dispatch = useDispatch()

  // ** Hooks
  const { id } = useParams()

  // ** Get suer on mount
  useEffect(() => {
    dispatch(getRoute(parseInt(id)))
  }, [])

  //const [active, setActive] = useState('1')

  /*const toggleTab = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }*/

  /* const handleRoutes = (routeData) => {
    console.log(routeData)
  }

  const markers_data = [
    {
      position: {lat: 28.549129060861027, lng: 77.34467952978068},
      draggable: true,
      title: "Samsung R&D Institute"
    }
  ] */ 

  return store.selectedRoute !== null && store.selectedRoute !== undefined ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='12' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
        <CustomMap
          markers={store.selectedRoute.marker_data ?? ''}
          zoom={12}
          directions={[
            {
           // destination: {query: store.selectedRoute.ending_point ?? ''},
            destination: store.selectedRoute.ending_point ?? '',
           // origin: {query: store.selectedRoute.starting_point ?? ''},
            origin: store.selectedRoute.starting_point ?? '',
            waypoints: store.selectedRoute.waypoint_data,
            travelMode: "DRIVING"
           }
          ]}
         // selectedData={handleRoutes}
          //start={{label: store.selectedRoute.starting_point, geoposition: store.selectedRoute.starting_point_code}}
          //end={{label: store.selectedRoute.ending_point, geoposition: store.selectedRoute.ending_point_code}}
          //via={store.selectedRoute.waypoint_data}
        />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Route not found</h4>
      <div className='alert-body'>
        Bus with id: {id} doesn't exist. Check list of all Buses: <Link to='/apps/routes/list'>Routes  </Link>
      </div>
    </Alert>
  )
}
export default UserView
