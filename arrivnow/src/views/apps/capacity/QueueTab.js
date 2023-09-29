// ** Reactstrap Imports\
import { Badge, Card, CardHeader, CardTitle, CardBody, Table, Row, Col, Button, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import QueueStatsCard from './QueueStat'
import BarChart from '@src/views/charts/chart-js/ChartjsBarChart'
import { useState, useEffect } from 'react'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getAllData, updateRouteChange } from './store'
import { useDispatch, useSelector } from 'react-redux'
const MySwal = withReactContent(Swal)

// ** Context
//import { ThemeColors } from '@src/utility/context/ThemeColors'
/* const recentQueueArr = [
  {
    Name: 'Sanjeev',
    Bus: 'DL14 RD 7485',
    Route: 'Samsung gurgaon to faridabaad'
  },
  {
    Name: 'Amit',
    Bus: 'DL14 RD 7485',
    Route: 'Samsung gurgaon to faridabaad'
  },
  {
    Name: 'Gourav',
    Bus: 'DL18 XC 1234',
    Route: 'Samsung manesar to gurgaon'
  },
  {
    Name: 'Suresh',
    Bus: 'DL14 RD 7485',
    Route: 'Samsung gurgaon to faridabaad'
  }
] */

const dailyQueueArr = [
  {
    Name: 'Sanjeev',
    Bus: 'DL14 RD 7485',
    prevRoute: 'Samsung gurgaon to faridabaad',
    newRoute: 'Samsung gurgaon to noida'
  },
  {
    Name: 'Amit',
    Bus: 'DL14 RD 7485',
    prevRoute: 'Samsung gurgaon to noida',
    newRoute: 'Samsung gurgaon to faridabaad'
  },
  {
    Name: 'Gourav',
    Bus: 'DL18 XC 1234',
    prevRoute: 'Samsung manesar to gurgaon',
    newRoute: 'Samsung gurgaon to manesar'
  },
  {
    Name: 'Suresh',
    Bus: 'DL14 RD 7485',
    prevRoute: 'Samsung gurgaon to faridabaad',
    newRoute: 'Samsung manesar to gurgaon'
  }
]

const routeQueueArr = [
  {
    Route: 'Samsung gurgaon to faridabaad',
    queue: 35
  },
  {
    Route: 'Samsung delhi to faridabaad',
    queue: 30
  },
  {
    Route: 'Samsung manesar to gurgaon',
    queue: 25
  },
  {
    Route: 'Samsung manesar to noida',
    queue: 20
  }
]

const statusObj = {
  pending: 'light-warning',
  approved: 'light-success',
  rejected: 'light-secondary'
}


const QueueData = () => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.routechanges)
  const recentQueueArr = store.allData

  console.log(recentQueueArr)
  const [userfilter, setuserfilter] = useState(0)
  const [emailfilter, setemailfilter] = useState(0)
  const [phonenofilter, setphonenofilter] = useState(0)
  const [statusfilter, setstatusfilter] = useState(0)

  const [centeredModal, setCenteredModal] = useState(false)

  const [showAdvancFilter, setAdvanceFilter] = useState(false)
  const showAF = () => {
    setAdvanceFilter(true)
    setCenteredModal(!centeredModal)
  }

  useEffect(() => {
    dispatch(getAllData())
  }, [dispatch, store.data.length])

  const hideAF = () => setAdvanceFilter(false)

  const handleSuspendedClick = (item_id) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You want to reject this route!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject Route!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(
          updateRouteChange({
            id: item_id,
            data: {status: 'rejected'}
          })
        )
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: 'Cancelled',
          text: 'Cancelled Suspension :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

  const handleApprovedClick = (item_id) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You want to approve this route!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve Route!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(
          updateRouteChange({
            id: item_id,
            data: { status: 'approved'}
          })
        )
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: 'Cancelled',
          text: 'Cancelled Approve :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

  const { skin } = useSkin(),
    labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
    gridLineColor = 'rgba(200, 200, 200, 0.2)',
    successColorShade = '#28dac6'
  return (
    <div>
      <Row className='match-height'>
        <Col xl='3' md='6' xs='12'>
          <QueueStatsCard cols={{ xl: '12', sm: '12' }} />
        </Col>
        <Col xl='4' md='6' xs='12'>
          <BarChart success={successColorShade} labelColor={labelColor} gridLineColor={gridLineColor} />
        </Col>
        <Col xl='5' md='6' xs='12'>
          <Card>
            <CardHeader className='border-bottom'>
              <CardTitle tag='h4'>Top 4 Queued Routes</CardTitle>
            </CardHeader>
            <CardBody className='my-2 py-25'>
              <div>

              </div>
              <Table className='text-nowrap text-center' responsive bordered>
                <thead>
                  <tr>
                    <th className='text-start'>Routes</th>
                    <th>Queue</th>
                  </tr>
                </thead>
                <tbody>
                  {routeQueueArr.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className='text-start'>
                          <span className='fw-bolder'>{item.Route}</span>
                        </td>
                        <td>{item.queue}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Queue Details</CardTitle>
        </CardHeader>
        <CardBody className='my-2 py-25'>
          <Table className='text-nowrap text-center' responsive bordered>
            <thead>
              <tr>
                <th className='text-start'>Name</th>
                <th>Bus</th>
                <th>Route</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentQueueArr ? recentQueueArr.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className='text-start'>
                      <span className='fw-bolder'>{(item.attributes.employee.data) ? item.attributes.employee.data.attributes.name : ''}</span>
                    </td>
                    <td>{(item.attributes.bus.data) ? item.attributes.bus.data.attributes.vehicle_number : ''} - {(item.attributes.bus.data) ? item.attributes.bus.data.attributes.colour : ''}</td>
                    <td>{(item.attributes.route.data) ? item.attributes.route.data.attributes.name : ''}</td>
                    {item.attributes.status !== 'pending' ? (<td>
                      <Badge className='text-capitalize' color={statusObj[item.attributes.status]} pill>
                        {item.attributes.status}
                      </Badge></td>) : ( 
                      <td>
                     
                      <Button color='primary' className='px-5' onClick={() => handleApprovedClick(item.id)}>
                      Approve
                    </Button>
                    <Button className='ms-1 px-5' color='danger' outline onClick={() => handleSuspendedClick(item.id)}>
                      Rejected
                    </Button>
                </td>)}
                    
                  </tr>
                )
              }) : null}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Daily Queue Details</CardTitle>
        </CardHeader>
        <CardBody className='my-2 py-25'>
          <div className='vertically-centered-modal'>
            {!showAdvancFilter ? <Button color='primary' outline onClick={() => setCenteredModal(!centeredModal)}>
              Show Advance filter
            </Button> : null}
            <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered'>
              <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Choose Advance filter</ModalHeader>
              <ModalBody>
                <div className='form-check form-check-inline'>
                  <Input type='checkbox' id='user' checked={userfilter} onChange={() => setuserfilter(!userfilter)} />
                  <Label for='basic-cb-unchecked' className='form-check-label'>
                    Name
                  </Label>
                </div><br />
                <div className='form-check form-check-inline'>
                  <Input type='checkbox' id='email' checked={emailfilter} onChange={() => setemailfilter(!emailfilter)} />
                  <Label for='basic-cb-unchecked' className='form-check-label'>
                    Previous Route
                  </Label>
                </div><br />
                <div className='form-check form-check-inline'>
                  <Input type='checkbox' id='phoneno' checked={phonenofilter} onChange={() => setphonenofilter(!phonenofilter)} />
                  <Label for='basic-cb-unchecked' className='form-check-label'>
                    New Route
                  </Label>
                </div><br />
                <div className='form-check form-check-inline'>
                  <Input type='checkbox' id='status' checked={statusfilter} onChange={() => setstatusfilter(!statusfilter)} />
                  <Label for='basic-cb-unchecked' className='form-check-label'>
                    Bus
                  </Label>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onClick={showAF}>
                  Filter
                </Button>
              </ModalFooter>
            </Modal>
            {showAdvancFilter ? <Row className='mt-1 mb-50'>
              {userfilter ? <Col lg='3' md='6' className='mb-1'>
                <Label className='form-label' for='name'>
                  User Name:
                </Label>
                <Input id='user_name' placeholder='' />
              </Col> : null}
              {emailfilter ? <Col lg='3' md='6' className='mb-1'>
                <Label className='form-label' for='pre_route'>
                  Previous Route:
                </Label>
                <Input
                  type='text'
                  id='email_id'
                  placeholder=''
                  value=''
                />
              </Col> : null}
              {phonenofilter ? <Col lg='3' md='6' className='mb-1'>
                <Label className='form-label' for='next_route'>
                  New Route:
                </Label>
                <Input id='phone_number' placeholder='' value='' />
              </Col> : null}
              {statusfilter ? <Col lg='3' md='6' className='mb-1'>
                <Label className='form-label' for='bus'>
                  Bus:
                </Label>
                <Input id='country' placeholder='' />
              </Col> : null}
              <Row>
                <Col lg='2' md='6' className='mb-1'>
                  <Button color='primary' className='px-3'>
                    Search
                  </Button>
                </Col>
                <Col lg='2' md='6' className='mb-1'>
                  <Button className='px-3' color='secondary' outline onClick={hideAF}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Row> : null}
          </div><br />
          <Table className='text-nowrap text-center' responsive bordered>
            <thead>
              <tr>
                <th className='text-start'>Name</th>
                <th>Previous Route</th>
                <th>New Route</th>
                <th>Bus</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dailyQueueArr.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className='text-start'>
                      <span className='fw-bolder'>{item.Name}</span>
                    </td>
                    <td>{item.prevRoute}</td>
                    <td>{item.newRoute}</td>
                    <td>{item.Bus}</td>
                    <td>
                      <Button color='primary' className='px-5' onClick={handleApprovedClick}>
                        Approve
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}

export default QueueData
