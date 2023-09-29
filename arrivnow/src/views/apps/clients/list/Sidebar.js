// ** React Import
import { useEffect, useState } from 'react'
// ** Custom Components
import Sidebar from '@components/sidebar'
//import axiosObj from '@src/axios'
//import { uploadFile } from 'react-s3'
// ** Third Party Components
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, FormFeedback } from 'reactstrap'

// ** Store & Actions
import { addClient, updateClient } from '../store'
import { useDispatch } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const defaultValues = {
  name: '',
  email: '',
  contact: '',
  //company: '',
  //fullName: '',
  registeration_no:'',
  //pancard_number: '',
  gst_number: '',
  gst_image_file:'',
  avatar_image_file: '',
  address: '',
  company_name: '',
  pan_number: '',
  pan_image_file:''
}

/* const config = {
  bucketName: 'arrivnow-images',
  region: 'us-east-2',
  accessKeyId: 'AKIAS3SGCEIKICCJPA5K',
  secretAccessKey: '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'
} */

/* const checkIsValid = data => {
  return Object.values(data).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
} */

const MySwal = withReactContent(Swal)

const SidebarNewUsers = ({ open, toggleSidebar, editMode, data }) => {
  // ** States
  //const [data, setData] = useState(null)
  const [gstImage, setGstImage] = useState(null)
  const [gstImagePreview, setGstImagePreview] = useState(null)
  const [avatarImage, setAvatarImage] = useState('')
  const [avatarImagePreview, setAvatarImagePreview] = useState('')
  const [panImage, setPanImage] = useState('')
  const [panImagePreview, setPanImagePreview] = useState('')
  // ** Store Vars
  const dispatch = useDispatch()
  const ClientSchema = yup.object().shape({
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
    company_name: yup.string().required("Company Name is a required field."),
    registeration_no: yup.string().required("Registration No is a required field."),
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
  // ** Var
  const {
    control,
    setValue,
   // setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ 
    defaultValues,
    resolver: yupResolver(ClientSchema)
  })

  useEffect(() => {
    if (editMode) {
      setValue('name', data.attributes.name ?? '')
      setValue('contact', data.attributes.mobile ?? '')
      setValue('email', data.attributes.email ?? '')
      setValue('registeration_no', data.attributes.registration_number ?? '')
      setValue('gst_number', data.attributes.gstnumber ?? '')
      setValue('address', data.attributes.address ?? '')
      setValue('company_name', data.attributes.companyname ?? '')
      setValue('pan_number', data.attributes.pancard ?? '')

      if (data.attributes.logo.data) {
        const av_image = (data.attributes.logo.data) ? data.attributes.logo.data[0].attributes.url : ''
        const avp_image = process.env.REACT_APP_IMAGEBASEURL + av_image
        setAvatarImagePreview(avp_image)
        setValue('avatar_image_file', 1)
      }

      if (data.attributes.gstimage.data) {
        const gst_image = (data.attributes.gstimage.data) ? data.attributes.gstimage.data.attributes.url : ''
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

  // ** Function to handle form submit
  const onSubmit = sdata => {
    console.log(sdata)
    //if (sdata.name !== '' && sdata.email !== '' && sdata.contact !== '' && sdata.address !== ''  && sdata.company_name !== '') {
      console.log(sdata)
      toggleSidebar()
      if (editMode) {
        return MySwal.fire({
          title: 'Are you sure?',
          text: "You want to update this client!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Updated Client!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1'
          },
          buttonsStyling: false
        }).then(function (result) {
          if (result.value) {
            dispatch(
              updateClient({
                id: data.id,
                data: {
                  name: sdata.name,
                  email: sdata.email.toString().toLowerCase(),
                  registration_number: sdata.registeration_no,
                  gstnumber: sdata.gst_number,
                  mobile: sdata.contact,
                  address: sdata.address,
                  companyname: sdata.company_name,
                  pancard: sdata.pan_number,
                  logo: avatarImage,
                  gstimage: gstImage,
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
          addClient({
            name: sdata.name,
            email: sdata.email.toString().toLowerCase(),
            //panCard: data.pancard_number,
            registration_number: sdata.registeration_no,
            gstnumber: sdata.gst_number,
            //gstimage: '',
            mobile: sdata.contact,
            status: 'pending',
            logo: avatarImage,
            gstimage: gstImage,
           // gst_certificate: gstcImage,
            address: sdata.address,
            companyname: sdata.company_name,
            pancard: sdata.pan_number,
            pancardimage: panImage
          })
        )
      }
    /*} else {
      for (const key in sdata) {
        if (editMode) {
          if (key === 'gst_image_file' || key === 'pan_image_file' || key === 'avatar_image_file') {
            continue
          }
        }
        if (sdata[key] !== null && sdata[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    } */
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
      title= {(!editMode) ? 'New Client' : 'Edit Client'}
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
              <Input id='name' placeholder='John Doe' invalid={errors.name && true} {...field} />
            )}
          />
          {errors.name && (
            <FormFeedback className='d-block'>{errors.name.message}</FormFeedback>
          )}
        </div>
        
        <div className='mb-1'>
          <Label className='form-label' for='avatar_image_file'>
           Logo <span className='text-danger'></span>
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
        <div className='mb-1'>
          <Label className='form-label' for='company_name'>
            Company Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='company_name'
            control={control}
            render={({ field }) => (
              <Input id='company_name' placeholder='' invalid={errors.company_name && true} {...field} />
            )}
          />
          {errors.company_name && (
            <FormFeedback className='d-block'>{errors.company_name.message}</FormFeedback>
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
        { /* <div className='mb-1'>
          <Label className='form-label' for='company'>
            Name Of Company <span className='text-danger'></span>
          </Label>
          <Controller
            name='company'
            control={control}
            render={({ field }) => (
              <Input id='company' placeholder='Company Pvt Ltd' {...field} />
            )}
          />
        </div>*/ }
        <div className='mb-1'>
          <Label className='form-label' for='registeration_no'>
          Registration No <span className='text-danger'></span>
          </Label>
          <Controller
            name='registeration_no'
            control={control}
            render={({ field }) => (
              <Input id='registeration_no' placeholder='Registration No' {...field} />
            )}
          />
          {errors.registeration_no && (
            <FormFeedback className='d-block'>{errors.registeration_no.message}</FormFeedback>
          )}
            </div>

            { /*  <div className='mb-1'>
          <Label className='form-label' for='pancard_number'>
            Pancard Number <span className='text-danger'></span>
          </Label>
          <Controller
            name='pancard_number'
            control={control}
            render={({ field }) => (
              <Input id='pancard_number' placeholder='Enter Pancard Number' {...field} />
            )}
          />
            </div>  */ }

        <div className='mb-1'>
          <Label className='form-label' for='gst_number'>
            GST Number <span className='text-danger'></span>
          </Label>
          <Controller
            name='gst_number'
            control={control}
            render={({ field }) => (
              <Input id='gst_number' placeholder='Enter GST Number' {...field} />
            )}
          />
          {errors.gst_number && (
            <FormFeedback className='d-block'>{errors.gst_number.message}</FormFeedback>
          )}
        </div> 
        
        <div className='mb-1'>
          <Label className='form-label' for='gst_image_file'>
            GST Image <span className='text-danger'></span>
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
          Pancard Image <span className='text-danger'></span>
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
