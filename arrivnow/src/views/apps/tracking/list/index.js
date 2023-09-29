// ** User List Component
import { useState, useEffect} from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
// import CustomMap from "@src/views/components/google-map"

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardTitle, CardBody, Table } from 'reactstrap'
import axiosObj from '@src/axios'
// ** Custom Components
//import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Icons Imports
//import { User, UserPlus, UserCheck, UserX } from 'react-feather'

// ** Styles
import '@styles/react/apps/app-users.scss'

/*const markers_data = [
  {
    position: {lat: 26.855656744649128, lng: 75.80682878024834},
    draggable: true,
    title: "Bus 1",
    onClick: () => {
      window.location.href = '/apps/tracking/view/1'
    }
  },
  {
    position: {lat: 26.867587892177657, lng: 75.80494912660922},
    draggable: true,
    title: "Bus 2",
    onClick: () => {
      window.location.href = '/apps/tracking/view/2'
    }
  },
  {
    position: {lat: 26.8941648467987, lng: 75.80340197078583},
    draggable: true,
    title: "Bus 3",
    onClick: () => {
      window.location.href = '/apps/tracking/view/3'
    }
  },
  {
    position: {lat: 26.90830026634008, lng: 75.80566975544507},
    draggable: true,
    title: "Bus 4",
    onClick: () => {
      window.location.href = '/apps/tracking/view/4'
    }
  },
  {
    position: {lat: 26.915857330597195, lng: 75.81022622230039},
    draggable: true,
    title: "Bus 5",
    onClick: () => {
      window.location.href = '/apps/tracking/view/5'
    }
  },
  {
    position: {lat: 26.91507, lng: 75.81972},
    draggable: true,
    title: "Bus 6",
    onClick: () => {
      window.location.href = '/apps/tracking/view/6'
    }
  },
  {
    position: {lat: 26.8794000, lng: 75.7487666},
    draggable: true,
    title: "Bus 7",
    onClick: () => {
      window.location.href = '/apps/tracking/view/7'
    }
  },
  {
    position: {lat: 28.549129060861027, lng: 77.34467952978068},
    draggable: true,
    title: "Bus 8",
    onClick: () => {
      window.location.href = '/apps/tracking/view/8'
    }
  },
  {
    position: {lat: 28.4060854634672, lng: 77.3038816389015},
    draggable: true,
    title: "Bus 9",
    onClick: () => {
      window.location.href = '/apps/tracking/view/9'
    }
  },
  {
    position: {lat: 28.476948315441003, lng: 77.0428865551833},
    draggable: true,
    title: "Bus 10",
    onClick: () => {
      window.location.href = '/apps/tracking/view/10'
    }
  }
] */

const TrackingList = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem('userData'))
    if (user_data.role === 'admin') {
      axiosObj.get(`/api/trips/ct`).then(response => setData(response.data))
    } else {
      const c_uuid = localStorage.getItem('client_uuid')
      axiosObj.get(`/api/trips/ct/${c_uuid}`).then(response => setData(response.data))
    }
  }, [])
  return (
    <div className='app-tracking-list'>
      { /* <CustomMap
        markers={markers_data}
        //polylines={pts}
        zoom={7}
        height='100vh'
  /> */}
    <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Trip Details</CardTitle>
        </CardHeader>
        <CardBody className='my-2 py-25'>
          <Table className='text-nowrap text-center' responsive bordered>
            <thead>
              <tr>
                <th className='text-start'>Trip Date</th>
                <th>Bus</th>
                <th>Route Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data ? data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className='text-start'>
                    <div className='d-flex flex-column'>
                      <Link
                        to={`/apps/tracking/view/${item.route_bus.bus.id}`}
                        className='user_name text-truncate text-body' >
                        <span className='fw-bolder'>{moment(item.tripdate).format("DD/MM/YYYY")}</span>
                      </Link>
                    </div>
                    </td>
                    <td>{(item.route_bus !== null && item.route_bus.bus) ? item.route_bus.bus.vehicle_number : ''} {(item.route_bus !== null && item.route_bus.bus) ? '-' : ''} {(item.route_bus !== null && item.route_bus.bus) ? item.route_bus.bus.colour : ''}</td>
                    <td>{(item.route_bus !== null && item.route_bus.route) ? item.route_bus.route.name : ''}</td>
                    <td><div className='d-flex flex-column'>
                      <Link
                        to={`/apps/tracking/view/${item.id}`}
                        className='user_name text-truncate text-body' >
                        <span className='fw-bolder'>View Trip</span>
                      </Link>
                    </div></td>
                    
                  </tr>
                )
              }) : null}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}

export default TrackingList
