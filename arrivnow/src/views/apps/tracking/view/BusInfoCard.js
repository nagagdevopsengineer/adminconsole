// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
//import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const BusInfoCard = ({speed}) => {
  console.log(speed)
  //const { speed = 0 } = this.props
  // ** Hook
  const {
    formState: { }
  } = useForm({
  })

  return (
    <Fragment>
      <Card>
        <CardBody>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>Bus Info</h4>
          <div className='info-container'>
              <ul className='list-unstyled'>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Current Speed:</span>
                  <span>{(speed) ? Number((speed).toFixed(2)) : 0} km/hr</span>
                </li>
               {/* <li className='mb-75'>
                  <span className='fw-bolder me-25'>Current location:</span>
                  <span>Samsung R&D Institute</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Previous Stopage:</span>
                  <span>Samsung SmartPlaza - Electromart Stores-Ocean Plaza</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Next Stopage:</span>
                  <span>SAMSUNG DISPLAY PVT. LTD. NOIDA</span>
  </li> */ }
              </ul>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default BusInfoCard
