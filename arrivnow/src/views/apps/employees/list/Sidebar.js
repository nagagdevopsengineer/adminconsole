// ** React Import
import { useEffect, useState } from 'react'
import moment from 'moment'
// ** Custom Components
import Sidebar from '@components/sidebar'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
// ** Third Party Components
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, FormFeedback } from 'reactstrap'

// ** Store & Actions
import { addEmployee, updateEmployee } from '../store'
import { useDispatch } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const defaultValues = {
  name: '',
  contact: '',
  email: '',
  avatar_image_file: null,
  address: '',
  employee_id: '',
  dob: ''
}
const MySwal = withReactContent(Swal)


const SidebarNewUsers = ({open, toggleSidebar, editMode, data  }) => {
  // ** States
  //const [setData] = useState(null)
  const [avatarImage, setAvatarImage] = useState('')
  const [avatarImagePreview, setAvatarImagePreview] = useState('')
  const [empDob, setEmpDob] = useState('')
  // ** Store Vars
  const dispatch = useDispatch()

  const EmployeeSchema = yup.object().shape({
    name: yup.string()
      .required("Name is a required field.")
      .max(32, 'name must be maximum 32 characters.')
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field."),
    avatar_image_file: yup.mixed().required("Photo is a required field.")
    .test("type", "Only the following formats are accepted: .jpeg, .jpg and .png", (value) => {
      if (value === null || value === 1) { return true }
        return value && (
          value.type === "image/jpeg" ||
          value.type === "image/png"
          //value.type === 'application/pdf'
        )
    }),
    email: yup.string().email().required(),
    contact: yup
      .string()
      .required("Contact Number is a required field.")
      .min(10, 'Contact Number must be minimum 10 characters.')
      .max(12, 'Contact Number must be maximum 12 characters.')
      .matches(/^[0-9]+$/, "Only numbers are allowed for this field."),
    address: yup.string().required("Address is a required field."),
    dob: yup.string().required("DOB is a required field.")
  })

  // ** Vars
  const {
    control,
    setValue,
    //setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ 
    defaultValues,
    resolver: yupResolver(EmployeeSchema)
  })

  useEffect(() => {
    if (editMode) {
      setValue('name', data.attributes.name)
      setValue('email', data.attributes.email)
      setValue('contact', data.attributes.contact)
      setValue('address', data.attributes.address ?? '')
      setValue('employee_id', data.attributes.employeeid ?? '')
      setValue('dob', data.attributes.dob ?? '')
      setEmpDob(data.attributes.dob ?? '')

      if (data.attributes.photo.data) {
        const vc_image = (data.attributes.photo.data) ? data.attributes.photo.data.attributes.url : ''
        const vcp_image = process.env.REACT_APP_IMAGEBASEURL + vc_image
        setAvatarImagePreview(vcp_image)
        setValue('avatar_image_file', 1)
      }
    }

  }, [])

  const checkIsValid = edata => {
    const checkData = { ...edata }
    delete checkData.employee_id
    return Object.values(checkData).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
  }

  // ** Function to handle form submit
  const onSubmit = sdata => {
    //setData(data)
    const client_uuid = localStorage.getItem('client_uuid')
    sdata.avatar_image_file = avatarImage ? avatarImage.name : ''
    sdata.dob = empDob ? empDob : ''
    
    if (checkIsValid(sdata) || true) {
      toggleSidebar()
      if (editMode) {
        return MySwal.fire({
          title: 'Are you sure?',
          text: "You want to update this employee!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Updated Employee!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1'
          },
          buttonsStyling: false
        }).then(function (result) {
          if (result.value) {
            dispatch(
              updateEmployee({
                id: data.id,
                data: {
                  name: sdata.name,
                  contact: sdata.contact,
                  email: sdata.email.toString().toLowerCase(),
                  address: sdata.address,
                  employeeid: sdata.employee_id,
                  photo: avatarImage,
                  dob: (empDob.constructor === Array) ? moment(empDob[0]).format("YYYY-MM-DD") : empDob
                }
              })
            )
          } else if (result.dismiss === MySwal.DismissReason.cancel) {
            MySwal.fire({
              title: 'Cancelled',
              text: 'Cancelled Update :)',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
          }
        })
      } else {
        
        dispatch(
          addEmployee({
            name: sdata.name,
            client: client_uuid,
            contact: sdata.contact,
            email: sdata.email.toString().toLowerCase(),
            photo: avatarImage,
            address: sdata.address,
            dob: moment(empDob[0]).format("YYYY-MM-DD"),
            employeeid: sdata.employee_id
          })
        )
      }
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
      clearErrors(key)
    }
    setAvatarImage('')
    setAvatarImagePreview('')
    setEmpDob('')
    setValue('avatar_image_file', null)
  }

  const onAvatarFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setAvatarImage(file_value)
    setAvatarImagePreview(URL.createObjectURL(file_value))
    setValue('avatar_image_file', file_value)
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title={editMode ? 'Edit Employee' : 'New Employee'}
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
        <div className='mb-1'>
          <Label className='form-label' for='name'>
            Full Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input id='name' placeholder='John Doe' invalid={errors.name && true} {...field} />
            )}
          />
          {errors.name && (
            <FormFeedback className='d-block'>{errors.name.message}</FormFeedback>
          )}
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='avatar_image_file'>
           Photo <span className='text-danger'>* [Allowed JPG or PNG]</span>
          </Label>
          <Input id='avatar_image_file' type="file" placeholder='Enter GST Number' invalid={errors.avatar_image_file && true} onChange={onAvatarFileChange} />
        
          {errors.avatar_image_file && (
            <FormFeedback className='d-block'>{errors.avatar_image_file.message}</FormFeedback>
          )}
          { avatarImagePreview ? <div className='mt-1'><img src={avatarImagePreview} width="150" height="150"/></div> : ''}
        </div>
        
        <div className='mb-1'>
          <Label className='form-label' for='email'>
            Email ID<span className='text-danger'>*</span>
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                type='email'
                id='email'
                placeholder='john.doe@example.com'
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          {errors.email && (
            <FormFeedback className='d-block'>{errors.email.message}</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='contact'>
            Contact Number <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='contact'
            control={control}
            render={({ field }) => (
              <Input id='contact' placeholder='(397) 294-5153' invalid={errors.contact && true} {...field} />
            )}
          />
          {errors.contact && (
            <FormFeedback className='d-block'>{errors.contact.message}</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='dob'>
           DOB <span className='text-danger'>*</span>
          </Label>
            <Flatpickr
                value={empDob}
                id='range-picker'
                className='form-control'
                onChange={date => {
                  setEmpDob(date)
                  setValue('dob', date[0])
                }}
                options={{
                  //defaultDate: ['2020-02-01', '2020-02-15'],
                  maxDate: new Date().fp_incr(-(18 * 365))
                }}
            />
            {errors.dob && (
            <FormFeedback className='d-block'>{errors.dob.message}</FormFeedback>
          )}
        </div>
        
        <div className='mb-1'>
          <Label className='form-label' for='address'>
          Address <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='address'
            control={control}
            render={({ field }) => (
              <Input id='address' type="textarea"  placeholder='Enter address' invalid={errors.address && true}  {...field} />
            )}
          />
          {errors.address && (
            <FormFeedback className='d-block'>{errors.address.message}</FormFeedback>
          )}
        </div> 
        <div className='mb-1'>
          <Label className='form-label' for='employee_id'>
          Employee ID<span className='text-danger'></span>
          </Label>
          <Controller
            name='employee_id'
            control={control}
            render={({ field }) => (
              <Input id='employee_id' placeholder='' {...field} />
            )}
          />
        </div>     
        <Button type='submit' className='me-1' color='primary'>
          Submit
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNewUsers
