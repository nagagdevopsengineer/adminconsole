// ** React Imports
import { Fragment } from 'react'
import moment from 'moment'
// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'

// ** Third Party Components
import { updateHelper } from '../store'
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
  Approved: 'light-success',
  pending: 'light-warning',
  Rejected: 'light-secondary'
}

/*  const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' }
] */


const MySwal = withReactContent(Swal)

const UserInfoCard = ({ selectedUser }) => {
  const dispatch = useDispatch()
  // ** Hook
  const {
    formState: {}
  } = useForm({
    defaultValues: {}
  })

  const vc_image = (selectedUser.attributes.vaccination_certificate.data) ? selectedUser.attributes.vaccination_certificate.data[0].attributes.url : ''
  const aadhar_image = (selectedUser.attributes.aadhar.data) ? selectedUser.attributes.aadhar.data.attributes.url : ''
  const dl_image = (selectedUser.attributes.drivinglicensefile.data) ? selectedUser.attributes.drivinglicensefile.data[0].attributes.url : ''

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

  const handleSuspendedClick = () => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert helper!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Suspend Helper!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(
          updateHelper({
            id: selectedUser.id,
            data: {status: 'Rejected'}
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
      text: "You won't be able to revert helper!",
      icon: 'primary',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve Helper!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(
          updateHelper({
            id: selectedUser.id,
            data: {status: 'Approved'}
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
                    <Badge color={roleColors[selectedUser.role]} className='text-capitalize px-3 py-1'>
                      Helper
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
            
      </div>
      <div className='info-container col-md-12 col-lg-12 col-xl-12 pad_10x'>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>Helper Info</h4>
            {selectedUser !== null ? (
              <div className='row'>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>Full Name</div>
                  <div className='usr_ipt_cust'>{selectedUser.attributes.name}</div>
                </div>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>Email</div>
                  <div className='usr_ipt_cust'>{selectedUser.attributes.email}</div>
                </div>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>Contact Number</div>
                  <div className='usr_ipt_cust'>{selectedUser.attributes.contact_number}</div>
                </div>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>DOB</div>
                  <div className='usr_ipt_cust'>{(selectedUser.attributes.DOB) ? moment(selectedUser.attributes.DOB).format('DD/MM/YYYY') : ''}</div>
                </div>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>Vaccination Status</div>
                  <div className='usr_ipt_cust'>{selectedUser.attributes.vaccination_status}</div>
                </div>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>Vaccination Certificate</div>
                  <div className='usr_ipt_cust'>{ vc_image ? <a href={process.env.REACT_APP_IMAGEBASEURL + vc_image} target="_blank">View Document</a> : ''}</div>
                </div>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>Aadhar Number</div>
                  <div className='usr_ipt_cust'>{selectedUser.attributes.aadharnumber}</div>
                </div>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>Aadhar Image</div>
                  <div className='usr_ipt_cust'>{ aadhar_image ? <a href={process.env.REACT_APP_IMAGEBASEURL + aadhar_image} target="_blank">View Document</a> : ''}</div>
                </div>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>Driving Licence Number</div>
                  <div className='usr_ipt_cust'>{selectedUser.attributes.drivinglicense}</div>
                </div>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>Driving Licence</div>
                  <div className='usr_ipt_cust'>{ dl_image ? <a href={process.env.REACT_APP_IMAGEBASEURL + dl_image} target="_blank">View Document</a> : ''}</div>
                </div>
                <div className='mb-75 col-6'>
                  <div className='fw-bolder me-25'>Status</div>
                  <div className='usr_ipt_cust'>
                    <Badge className='text-capitalize' color={statusColors[selectedUser.attributes.status ? selectedUser.attributes.status : 'psending']}>
                      {selectedUser.attributes.status ? selectedUser.attributes.status : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div> 
            ) : null}
            {selectedUser.attributes.status === 'Approved' ? null : (
            <div className='d-flex pt-2'>
              <Button color='primary' className='px-5' onClick={handleApprovedClick}>
                Approve
              </Button>
              <Button className='ms-1 px-5' color='danger' outline onClick={handleSuspendedClick}>
                Rejected
              </Button>
            </div>) }
        </div>
      </div>
      </CardBody>
      </Card>
    </Fragment>
  )
}

export default UserInfoCard
