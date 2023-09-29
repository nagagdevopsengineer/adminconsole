// ** React Imports
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
//import { getDriver } from '../store'
//import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'
import axios from '@src/axios'
// ** User View Components
import UserTabs from './Tabs'
import PlanCard from './PlanCard'
import BusInfoCard from './BusInfoCard'
//import CustomMap from "@src/views/components/google-map/routeTracking.js"
import CustomMap from "@src/views/components/google-map/polylines.js"
// ** Styles
import '@styles/react/apps/app-users.scss'
//import { number } from 'prop-types'


/*const markers_data = [
  {
    position: {lat: 28.549129060861027, lng: 77.34467952978068},
    draggable: true,
    title: "Samsung R&D Institute"
  }
] */

const UserView = () => {
  // ** Store Vars
  //const store = useSelector(state => state.drivers)
  //const dispatch = useDispatch()
  let last_speed = 0
  // ** Hooks
  const { id } = useParams()
  const [data, setData] = useState([])
  const [speed, setSpeed] = useState(0)
  //const [lastTimestamp, setLastTimestamp] = useState('')

  const filterData = (markerData) => {
    const newMarkers = []
    let lastSpeed = 0
    let l_lat = 0
    let l_lng = 0
    markerData.map((mv) => {
      
      const v_speed = Math.floor(mv.speed)
     // const v_lat = Number(mv.latitude).toPrecision(6)
     const v_lat = mv.latitude.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]
     const v_lng = mv.longitude.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]
      if (lastSpeed === 1 && v_speed === 0) {
        //newMarkers.push(mv)
        //lastSpeed = 1
      } else {
        if (v_speed === 0) {
          lastSpeed = 1
        } else {
          lastSpeed = 0
        }

        if (v_lat === l_lat && v_lng === l_lng) {
        } else {
          l_lat = v_lat
          l_lng = v_lng
          newMarkers.push(mv)
        }
        
      }
    })
    return newMarkers
  }
  // ** Get suer on mount
  useEffect(() => {
    let counter = 0
    //let m_counter = 4
    let lastTimestamp = 0
    
    let prev_data = []
    //let last_id = 0
    if (counter === 0) {
      axios.get(`http://65.0.139.196:3000/vehicletrackingdetails?vehicleid=${id}`).then((response) => {
        const markerValues = response.data
        if (markerValues.length > 0) {
          console.log(markerValues)
         // markerValues = markerValues.slice(0, Math.max(markerValues.length - 100))
         const m_data = filterData(markerValues)
         console.log(m_data)
          setData(m_data)
          prev_data = m_data
         /* markerValues.map((mv) => {
            if (lastTimestamp < mv.timestamp) {
              lastTimestamp = mv.timestamp
            } 
          }) */
          lastTimestamp = markerValues[markerValues.length - 1].timestamp
          last_speed = markerValues[markerValues.length - 1].speed
          setSpeed(last_speed)
          console.log(last_speed)
          //last_id = markerValues[markerValues.length - 1].id
          //setLastTimestamp(last_time)
          counter = counter + 1
        }
      }
      )
    }
    const myInterval = setInterval(() => {
      console.log(lastTimestamp)
      
        axios.get(`http://65.0.139.196:3000/vehicletrackingdetails?vehicleid=${id}&timestamp=${lastTimestamp}`).then((response) => {
          const markerValues = response.data    
         
          if (markerValues.length > 0) { 
            const m_data = filterData(markerValues)
            //setData([])
            //console.log(m_counter)
           // markerValues = markerValues.slice(0, Math.max(markerValues.length - (m_counter * 20)))
            const marker_d = [...prev_data, ...m_data]
            prev_data = marker_d
            /*marker_d.sort(function(a, b) {
              return a[6] - b[6]
            })*/
            setData(marker_d)
            /* marker_d.map((mv) => {
              if (lastTimestamp < mv.timestamp) {
                lastTimestamp = mv.timestamp
              } 
            }) */

            lastTimestamp = marker_d[marker_d.length - 1].timestamp
            last_speed = marker_d[marker_d.length - 1].speed
            setSpeed(last_speed)
            console.log(last_speed)
            counter = counter + 1
            //m_counter = m_counter - 1
          }
        }
        )
      
    }, 10000)
    return () => {
        clearInterval(myInterval)
      }
    }, [])

  //const [active, setActive] = useState('1')

  /*const toggleTab = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }*/

  return data.length > 0 ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='6' lg='4' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <CustomMap markers={data} zoom={18} />
        </Col>
        <Col xl='6' lg='8' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <BusInfoCard speed={speed}/>
        </Col>
      </Row>
      <Row>
        <Col xl='12' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Trip data not found</h4>
      <div className='alert-body'>
        Trip data with id: {id} doesn't exist. Check list of all Trips: <Link to='/apps/tracking/list'>Tracking  </Link>
      </div>
    </Alert>
  )
}
export default UserView
