// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'

// ** Third Party Components
import { updateContractor } from '../store'
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

/* const statusOptions = [
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
    //reset,
    //control,
    //setError,
    //handleSubmit,
    //formState: { errors }
  } = useForm({
  })
  
  const gst_image = (selectedUser.attributes.gst_certificate.data) ? selectedUser.attributes.gst_certificate.data[0].attributes.url : ''
  const pan_image = (selectedUser.attributes.pancardimage.data) ? selectedUser.attributes.pancardimage.data[0].attributes.url : ''
  // ** render user img
  const renderUserImg = () => {
    const user_image = (selectedUser.attributes.photo.data) ? selectedUser.attributes.photo.data.attributes.url : ''
    if (selectedUser !== null && user_image) {
      return (
        <img
          height='110'
          width='110'
          alt='user-avatar'
          src={process.env.REACT_APP_IMAGEBASEURL + user_image}
          className='img-fluid rounded mt-3 mb-2'
        />
      )
    } else {
      const stateNum = Math.floor(Math.random() * 6),
        states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
        color = states[stateNum]
      return (
        <Avatar
          initials
          color={color}
          className='mt-1 mb-2'
          content={selectedUser.attributes.name}
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
  }

  /*const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      setShow(false)
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  const handleReset = () => {
    reset({
      username: selectedUser.username,
      lastName: selectedUser.fullName.split(' ')[1],
      firstName: selectedUser.fullName.split(' ')[0]
    })
  } */

  const handleSuspendedClick = () => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You want to reject this contractor!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Rejected contractor!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(
          updateContractor({
            id: selectedUser.id,
            data: {
            email: selectedUser.attributes.email,
            name: selectedUser.attributes.name,
            status: "rejected" }
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
      text: "You want to approve this contractor!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve contractor!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(
          updateContractor({
            id: selectedUser.id,
            data: {
            email: selectedUser.attributes.email,
            name: selectedUser.attributes.name,
            status: "approved" }
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
                        <h4>{selectedUser !== null ? selectedUser.attributes.name : 'Eleanor Aguilar'}</h4>
                        {selectedUser !== null ? (
                          <Badge color={roleColors['editor']} className='text-capitalize px-3 py-1'>
                            Contractor
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  
            </div>
            <div className='info-container col-md-12 col-lg-12 col-xl-12 pad_10x'>
                  <h4 className='fw-bolder border-bottom pb-50 mb-1'>Contractor Info</h4>
                    {selectedUser !== null ? (
                     <div className='row'>
                        <div className='mb-75 col-4'>
                          <div className='fw-bolder me-25'>Email</div>
                          <div className='usr_ipt_cust'>{selectedUser.attributes.email}</div>
                        </div>
                        <div className='mb-75 col-4'>
                          <div className='fw-bolder me-25'>Contact</div>
                          <div className='usr_ipt_cust'>{selectedUser.attributes.contactnumber}</div>
                        </div>
                        { /*<div className='mb-75 col-4'>
                          <div className='fw-bolder me-25'>Company</div>
                          <div className='usr_ipt_cust'>{selectedUser.attributes.company ?? ''}</div>
                        </div>*/}
                        <div className='mb-75 col-4'>
                          <div className='fw-bolder me-25'>Address</div>
                          <div className='usr_ipt_cust'>{selectedUser.attributes.address}</div>
                        </div>
                        <div className='mb-75 col-4'>
                          <div className='fw-bolder me-25'>Registration Number</div>
                          <div className='usr_ipt_cust'>{selectedUser.attributes.reg_number ?? ''}</div>
                        </div>
                        <div className='mb-75 col-4'>
                          <div className='fw-bolder me-25'>GST Number</div>
                          <div className='usr_ipt_cust'>{selectedUser.attributes.gst ?? ''}</div>
                        </div>
                        <div className='mb-75 col-4'>
                  <div className='fw-bolder me-25'>GST Image</div>
                  <div className='usr_ipt_cust'>{ gst_image ? <a href={process.env.REACT_APP_IMAGEBASEURL + gst_image} target="_blank">View Document</a> : ''}</div>
                </div>
                        <div className='mb-75 col-4'>
                          <div className='fw-bolder me-25'>Pancard Number</div>
                          <div className='usr_ipt_cust'>{selectedUser.attributes.pancard ?? ''}</div>
                        </div>
                        <div className='mb-75 col-4'>
                  <div className='fw-bolder me-25'>Pancard Image</div>
                  <div className='usr_ipt_cust'>{ pan_image ? <a href={process.env.REACT_APP_IMAGEBASEURL + pan_image} target="_blank">View Document</a> : ''}</div>
                </div>
                        { /* <div className='mb-75 col-4'>
                          <div className='fw-bolder me-25'>Country</div>
                          <div className='usr_ipt_cust'>{selectedUser.country}</div>
                        </div>
                        <div className='mb-75 col-4'>
                          <div className='fw-bolder me-25'>Number of Buses</div>
                          <div className='usr_ipt_cust'>{selectedUser.number_of_buses}</div>
                    </div> */}
                        <div className='mb-75 col-4'>
                          <div className='fw-bolder me-25'>Status</div>
                          <div className='usr_ipt_cust'>
                            <Badge className='text-capitalize' color={statusColors[selectedUser.attributes.status]}>
                              {selectedUser.attributes.status}
                            </Badge>
                          </div>
                        </div>
                      {/*}  <div className='mb-75 col-6'>
                          <div className='fw-bolder me-25'>Any Bus Complaint</div>
                          <div className='usr_ipt_cust'>{selectedUser.any_bus_complaint}</div>
                        </div>
                        <div className='mb-75 col-6'>
                          <div className='fw-bolder me-25'>Any Defect</div>
                          <div className='usr_ipt_cust'>{selectedUser.any_defect}</div>
                        </div>
                        <div className='mb-75 col-6'>
                          <div className='fw-bolder me-25'>Any Police Complaint</div>
                          <div className='usr_ipt_cust'>{selectedUser.any_police_complaint}</div>
                        </div> */}
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
