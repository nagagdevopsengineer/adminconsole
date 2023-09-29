// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'

// ** Third Party Components
import { updateBus } from '../store'
import Swal from 'sweetalert2'
import Select from 'react-select'
import { Check, Briefcase, X } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'
import { useDispatch } from 'react-redux'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
//import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const roleColors = {
  editor: 'light-info',
  admin: 'light-danger',
  author: 'light-warning',
  maintainer: 'light-success',
  subscriber: 'light-primary'
}

const statusColors = {
  approved: 'light-success',
  pending: 'light-warning',
  rejected: 'light-secondary'
}

/*const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' }
]

const countryOptions = [
  { value: 'uk', label: 'UK' },
  { value: 'usa', label: 'USA' },
  { value: 'france', label: 'France' },
  { value: 'russia', label: 'Russia' },
  { value: 'canada', label: 'Canada' }
]

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'dutch', label: 'Dutch' }
] */

const MySwal = withReactContent(Swal)

const UserInfoCard = ({ selectedUser }) => {
  // ** State
  //const [show, setShow] = useState(false)
  const dispatch = useDispatch()
  // ** Hook
  const {
    formState: {}
  } = useForm({
    defaultValues: { }
  })

  const rc_image = (selectedUser.attributes.rc_certificate.data) ? selectedUser.attributes.rc_certificate.data[0].attributes.url : ''
  const puc_image = (selectedUser.attributes.puccertificate.data) ? selectedUser.attributes.puccertificate.data.attributes.url : ''
  const fitness_image = (selectedUser.attributes.fitnesscertificate.data) ? selectedUser.attributes.fitnesscertificate.data[0].attributes.url : ''

  // ** render user img
  const renderUserImg = () => {
      const stateNum = Math.floor(Math.random() * 6),
        states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
        color = states[stateNum]
      return (
        <Avatar
          initials
          color={color}
          className='mt-1 mb-2'
          content='Bus 1'
          contentStyles={{
            borderRadius: 0,
            fontSize: 'calc(48px)',
            width: '100%',
            height: '100%'
          }}
          style={{
            height: '110px',
            width: '110px'
          }}
        />
      )
  }

  const handleSuspendedClick = () => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You want to reject this bus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Suspend Bus!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(
          updateBus({
            id: selectedUser.id,
            data: {status: 'reject'}
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

  const handleApprovedClick = () => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You want to approve this bus!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve Bus!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(
          updateBus({
            id: selectedUser.id,
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

  return (
    <Fragment>
      <Card>
        <CardBody className='px-1'>
      <div className='row'>
        <div className='user-avatar-section col-md-12 col-lg-12 col-xl-12 mb-4 uas_back pad_10x'>
          
            <div className='d-flex flex-column'>
              {renderUserImg()}
              <div className='d-flex flex-column mb-2'>
                <div className='user-info'>
                  <h4>{selectedUser !== null ? selectedUser.attributes.vehicle_number : 'DL12DF4561'}</h4>
                  {selectedUser !== null ? (
                    <Badge color={roleColors[selectedUser.role]} className='text-capitalize px-3 py-1'>
                      Bus
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
        </div>
         
        <div className='info-container col-md-12 col-lg-12 col-xl-12 pad_10x'>
            <h4 className='fw-bolder border-bottom pb-50 mb-1'>Bus Info</h4>
                {selectedUser !== null ? (
                  <div className='row'>
                    <div className='mb-75 col-4'>
                      <div className='fw-bolder me-25'>Vehicle Number</div>
                      <div className='usr_ipt_cust'>{selectedUser.attributes.vehicle_number}</div>
                    </div>
                    <div className='mb-75 col-4'>
                      <div className='fw-bolder me-25'>Vehicle Colour</div>
                      <div className='usr_ipt_cust'>{selectedUser.attributes.colour}</div>
                    </div>
                    <div className='mb-75 col-4'>
                      <div className='fw-bolder me-25'>Seating Capacity</div>
                      <div className='usr_ipt_cust'>{selectedUser.attributes.seating_capacity}</div>
                    </div>
                    <div className='mb-75 col-6'>
                      <div className='fw-bolder me-25'>PUC Number</div>
                      <div className='usr_ipt_cust'>{selectedUser.attributes.puc ?? ''}</div>
                    </div>
                    <div className='mb-75 col-6'>
                      <div className='fw-bolder me-25'>PUC Certificate</div>
                      <div className='usr_ipt_cust'>{ puc_image ? <a href={process.env.REACT_APP_IMAGEBASEURL + puc_image} target="_blank">View Document</a> : ''}</div>
                    </div>
                    <div className='mb-75 col-6'>
                      <div className='fw-bolder me-25'>RC Certificate</div>
                      <div className='usr_ipt_cust'>{ rc_image ? <a href={process.env.REACT_APP_IMAGEBASEURL + rc_image} target="_blank">View Document</a> : ''}</div>
                    </div>
                    <div className='mb-75 col-6'>
                      <div className='fw-bolder me-25'>Fitness Certificate</div>
                      <div className='usr_ipt_cust'>{ fitness_image ? <a href={process.env.REACT_APP_IMAGEBASEURL + fitness_image} target="_blank">View Document</a> : ''}</div>
                    </div>
                    { /* <div className='mb-75 col-6'>
                      <div className='fw-bolder me-25'>Bus insurance</div>
                      <div className='usr_ipt_cust'></div>
                    </div>
                    <div className='mb-75 col-6'>
                      <div className='fw-bolder me-25'>Seating arrangement</div>
                      <div className='usr_ipt_cust'></div>
                    </div>
                    <div className='mb-75 col-6'>
                      <div className='fw-bolder me-25'>Any Police Complaint</div>
                      <div className='usr_ipt_cust'>{selectedUser.any_police_complaint}</div>
                    </div>
                    <div className='mb-75 col-6'>
                      <div className='fw-bolder me-25'>Any Major Accident</div>
                      <div className='usr_ipt_cust'>{selectedUser.any_major_accident}</div>
                    </div>
                    
                    <div className='mb-75 col-4'>
                      <div className='fw-bolder me-25'>Ac/Non Ac</div>
                      <div className='usr_ipt_cust'>{selectedUser.is_ac}</div>
                    </div>
                    
                    <div className='mb-75 col-4'>
                      <div className='fw-bolder me-25'>Is Cctv available</div>
                      <div className='usr_ipt_cust'>{selectedUser.is_cctv_available}</div>
                      </div> */ }
                    <div className='mb-75 col-4'>
                      <div className='fw-bolder me-25'>Status</div>
                      <div className='usr_ipt_cust'>
                      <Badge className='text-capitalize' color={statusColors[selectedUser.attributes.status]}>
                      {selectedUser.attributes.status}
                    </Badge>
                      </div>
                    </div>
                  </div>
                ) : null}
                 {selectedUser.attributes.status === 'approved' ? null : (
              <div className='d-flex pt-2'>
                <Button color='primary' className='px-5' onClick={handleApprovedClick}>
                  Approve
                </Button>
                <Button className='ms-1 px-5' color='danger' outline onClick={handleSuspendedClick}>
                  Rejected
                </Button>
            </div>
            )
          }
          </div>
        </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UserInfoCard
