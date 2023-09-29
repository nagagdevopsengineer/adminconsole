// ** React Import
import { useEffect, useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Third Party Components
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, FormFeedback } from 'reactstrap'

// ** Store & Actions
import { addContractor, updateContractor } from '../store'
import { useDispatch } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const defaultValues = {
  email: '',
  contact: '',
  name: '',
  gst_number: '',
  reg_number: '',
  avatar_image_file: null,
  gst_image_file: null,
  address: '',
  pan_number: '',
  pan_image_file: null
} 

const MySwal = withReactContent(Swal)
const SidebarNewUsers = ({ open, toggleSidebar, editMode, data  }) => {
  // ** States
  //const [data, setData] = useState(null)
  const [avatarImage, setAvatarImage] = useState('')
  const [avatarImagePreview, setAvatarImagePreview] = useState('')
  const [gstImage, setGstImage] = useState('')
  const [gstImagePreview, setGstImagePreview] = useState('')
  const [panImage, setPanImage] = useState('')
  const [panImagePreview, setPanImagePreview] = useState('')
  // ** Store Vars
  const dispatch = useDispatch()

  const ContractorSchema = yup.object().shape({
    name: yup.string()
      .required("Name is a required field.")
      .max(32, 'name must be maximum 32 characters.')
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field."),
    avatar_image_file: yup.mixed().nullable(true).transform((v, o) => (o === '' ? null : v))
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
    reg_number: yup.string().required("Registration No is a required field."),
    gst_number: yup.string().required("GST Number is a required field."),
    gst_image_file: yup.mixed().nullable(true).transform((v, o) => (o === '' ? null : v))
    .test("type", "Only the following formats are accepted: .jpeg, .jpg, .png and .pdf", (value) => {
      if (value === null || value === 1) { return true }
        return value && (
          value.type === "image/jpeg" ||
          value.type === "image/png" || 
          value.type === 'application/pdf'
        )
    }),
    pan_number: yup.string().nullable(true).transform((v, o) => (o === '' ? null : v)).min(10, 'PAN Number must be minimum 10 characters.'),
    pan_image_file: yup.mixed().nullable(true).transform((v, o) => (o === '' ? null : v))
    .test("type", "Only the following formats are accepted: .jpeg, .jpg, .png and .pdf", (value) => {
      if (value === null || value === 1) { return true }
        return value && (
          value.type === "image/jpeg" ||
          value.type === "image/png" || 
          value.type === 'application/pdf'
        )
    })
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
    resolver: yupResolver(ContractorSchema)
  })

  useEffect(() => {
    if (editMode) {
      setValue('name', data.attributes.name ?? '')
      setValue('email', data.attributes.email ?? '')
      setValue('contact', data.attributes.contactnumber ?? '')
      setValue('gst_number', data.attributes.gst ?? '')
      setValue('reg_number', data.attributes.reg_number ?? '')
      setValue('address', data.attributes.address ?? '')
      setValue('pan_number', data.attributes.pancard ?? '')

      if (data.attributes.photo.data) {
        const av_image = (data.attributes.photo.data) ? data.attributes.photo.data.attributes.url : ''
        const avp_image = process.env.REACT_APP_IMAGEBASEURL + av_image
        setAvatarImagePreview(avp_image)
        setValue('avatar_image_file', 1)
      }

      if (data.attributes.gst_certificate.data) {
        const gst_image = (data.attributes.gst_certificate.data) ? data.attributes.gst_certificate.data[0].attributes.url : ''
        const gp_image = process.env.REACT_APP_IMAGEBASEURL + gst_image
        setGstImagePreview(gp_image)
        setValue('gst_image_file', 1)
      }

      if (data.attributes.pancardimage.data) {
        const pv_image = (data.attributes.pancardimage.data) ? data.attributes.pancardimage.data[0].attributes.url : ''
        const pvc_image = process.env.REACT_APP_IMAGEBASEURL + pv_image
        setPanImagePreview(pvc_image)
        setValue('pan_image_file', 1)
      }
    }

  }, [])

  /* const checkIsValid = data => {
    const checkdata = data
    delete checkdata.any_police_complaint
    delete checkdata.any_defect
    delete checkdata.any_bus_complaint
    delete checkdata.avatar_image_file
    delete checkdata.gst_image_file
    delete checkdata.pan_image_file
  
    return Object.values(checkdata).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
  } */ 

  // ** Function to handle form submit
  const onSubmit = sdata => {
    //setData(data)
    const client_uuid = localStorage.getItem('client_uuid')
    console.log(sdata)
    //if (checkIsValid(sdata)) {
      toggleSidebar()
      if (editMode) {
        return MySwal.fire({
          title: 'Are you sure?',
          text: "You want to update this contractor!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Updated contractor!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1'
          },
          buttonsStyling: false
        }).then(function (result) {
          if (result.value) {
        dispatch(
          updateContractor({
            id: data.id,
            data: {
              name: sdata.name,
              email: sdata.email.toString().toLowerCase(),
              contactnumber: sdata.contact,
              gst: sdata.gst_number,
              reg_number: sdata.reg_number,
              address: sdata.address,
              pancard: sdata.pan_number,
              photo: avatarImage,
              gst_certificate: gstImage,
              pancardimage: panImage
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
          addContractor({
            client: client_uuid,
            status: "pending",
            name: sdata.name,
            email: sdata.email.toString().toLowerCase(),
            contactnumber: sdata.contact,
            gst: sdata.gst_number,
            reg_number: sdata.reg_number,
            photo: avatarImage,
            gst_certificate: gstImage,
            address: sdata.address,
            pancard: sdata.pan_number,
            pancardimage: panImage
          })
        )
      }
   /* } else {
      for (const key in sdata) {
        console.log(key)
        if (sdata[key] !== null && sdata[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      } 
    }*/
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
      clearErrors(key)
    }
    setAvatarImage('')
    setAvatarImagePreview('')
    setValue('avatar_image_file', null)
    setGstImage('')
    setGstImagePreview('')
    setValue('gst_image_file', null)
    setPanImage('')
    setPanImagePreview('')
    setValue('pan_image_file', null)
  }
    
  const onAvatarFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setAvatarImage(file_value)
    setAvatarImagePreview(URL.createObjectURL(file_value))
    setValue('avatar_image_file', file_value)
  }

  const onGstFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setGstImage(file_value)
    setGstImagePreview(URL.createObjectURL(file_value))
    setValue('gst_image_file', file_value)
  }

  const onPanFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setPanImage(file_value)
    setPanImagePreview(URL.createObjectURL(file_value))
    setValue('pan_image_file', file_value)
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title={(!editMode) ? 'New Contractor' : 'Edit Contractor'}
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='name'>
            Full Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input id='name' placeholder='' invalid={errors.name && true} {...field} />
            )}
          />
          {errors.name && (
            <FormFeedback className='d-block'>{errors.name.message}</FormFeedback>
          )}
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='avatar_image_file'>
           Photo <span className='text-danger'> [Allowed JPG or PNG]</span>
          </Label>
          <Input id='avatar_image_file' type="file" placeholder='Enter GST Number' onChange={onAvatarFileChange} />
           
          {errors.avatar_image_file && (
            <FormFeedback className='d-block'>{errors.avatar_image_file.message}</FormFeedback>
          )}
           { avatarImagePreview ? <div className='mt-1'><img src={avatarImagePreview} width="150" height="150"/></div> : ''}
        </div>
        
        <div className='mb-1'>
          <Label className='form-label' for='userEmail'>
            Email ID<span className='text-danger'>*</span>
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                type='email'
                id='userEmail'
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
        {/*<div className='mb-1'>
          <Label className='form-label' for='pancard'>
            Pancard Number <span className='text-danger'></span>
          </Label>
          <Controller
            name='pancard'
            control={control}
            render={({ field }) => (
              <Input id='pancard' placeholder='' {...field} />
            )}
          />
        </div> */ }
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
          <Label className='form-label' for='reg_number'>
          Registration No <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='reg_number'
            control={control}
            render={({ field }) => (
              <Input id='reg_number' placeholder='Enter Registration Number' invalid={errors.reg_number && true} {...field} />
            )}
          />
          {errors.reg_number && (
            <FormFeedback className='d-block'>{errors.reg_number.message}</FormFeedback>
          )}
        </div> 
        <div className='mb-1'>
          <Label className='form-label' for='gst_number'>
            GST Number <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='gst_number'
            control={control}
            render={({ field }) => (
              <Input id='gst_number' placeholder='Enter GST Number' invalid={errors.contact && true} {...field} />
            )}
          />
          {errors.gst_number && (
            <FormFeedback className='d-block'>{errors.gst_number.message}</FormFeedback>
          )}
        </div>  

        <div className='mb-1'>
          <Label className='form-label' for='gst_image_file'>
           GST Certificate <span className='text-danger'> [Allowed JPG, PNG or PDF]</span>
          </Label>
          <Input id='gst_image_file' type="file" placeholder='Enter GST Number' onChange={onGstFileChange} />

          {errors.gst_image_file && (
            <FormFeedback className='d-block'>{errors.gst_image_file.message}</FormFeedback>
          )}
           { gstImagePreview ? <div className='mt-1'><img src={gstImagePreview} width="150" height="150"/></div> : ''}
        </div>
        
        <div className='mb-1'>
          <Label className='form-label' for='pan_number'>
            Pancard Number <span className='text-danger'></span>
          </Label>
          <Controller
            name='pan_number'
            control={control}
            render={({ field }) => (
              <Input id='pan_number' placeholder='Enter Pancard Number' {...field} />
            )}
          />
          {errors.pan_number && (
            <FormFeedback className='d-block'>{errors.pan_number.message}</FormFeedback>
          )}
        </div> 
        
        <div className='mb-1'>
          <Label className='form-label' for='pan_image_file'>
          Pancard Image <span className='text-danger'>[Allowed JPG, PNG or PDF]</span>
          </Label>
            <Input id='pan_image_file' type="file" placeholder='Enter GST Number' onChange={onPanFileChange} />
          {errors.pan_image_file && (
            <FormFeedback className='d-block'>{errors.pan_image_file.message}</FormFeedback>
          )}
           { panImagePreview ? <div className='mt-1'><img src={panImagePreview} width="150" height="150"/></div> : ''}
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
