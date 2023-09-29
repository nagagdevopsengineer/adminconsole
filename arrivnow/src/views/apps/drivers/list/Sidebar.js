// ** React Import
import { useEffect, useState } from 'react'
import Select from 'react-select'
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
import { addDriver, updateDriver } from '../store'
import { useDispatch, useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const defaultValues = {
  name: '',
  dob: '', 
  driving_licence_number: '', 
  aadhar: '',
  email: '',
  mobile: '',
  avatar_image_file: null,
  dl_image_file: null,
  aadhar_image_file: null,
  vaccination_status: 'No',
  vc_image_file: null
}

const MySwal = withReactContent(Swal)
const SidebarNewUsers = ({ open, toggleSidebar, editMode, data}) => {
  // ** States
  //const [data, setData] = useState(null)
  const [avatarImage, setAvatarImage] = useState('')
  const [avatarImagePreview, setAvatarImagePreview] = useState('')
  const [dlImage, setDlImage] = useState('')
  const [dlImagePreview, setDlImagePreview] = useState('')
  const [aadharImage, setAadharImage] = useState('')
  const [aadharImagePreview, setAadharImagePreview] = useState('')
  const [vcImage, setVcImage] = useState('')
  const [vcImagePreview, setVcImagePreview] = useState('')
  const [vcStatus, setVcStatus] = useState('No')
  const [empDob, setEmpDob] = useState('')
  const [invalidDob, setInvalidDob] = useState(false)
  // ** Store Vars
  const dispatch = useDispatch()
  const DriverSchema = yup.object().shape({
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
    mobile: yup
      .string()
      .required("Contact Number is a required field.")
      .matches(/^[0-9]+$/, "Only numbers are allowed for this field.")
      .min(10, 'Contact Number must be minimum 10 characters.')
      .max(12, 'Contact Number must be maximum 12 characters.'),
    dob: yup.string().required("DOB is a required field."),
    aadhar: yup.string().required("Aadhar Number is a required field.")
      .matches(/^[0-9]+$/, "Only numbers are allowed for this field.")
      .min(12, 'Contact Number must be minimum 12 characters.'),
    driving_licence_number: yup.string().required("Driving Licence Number is a required field."),
    vc_image_file: yup.mixed().required("Vaccination Certificate is a required field.")
    .test("type", "Only the following formats are accepted: .jpeg, .jpg, .png and .pdf", (value) => {
      if (value === null || value === 1) { return true }
        return value && (
          value.type === "image/jpeg" ||
          value.type === "image/png" || 
          value.type === 'application/pdf'
        )
    }),
    dl_image_file: yup.mixed().required("Driving Licence is a required field.")
    .test("type", "Only the following formats are accepted: .jpeg, .jpg, .png and .pdf", (value) => {
        if (value === null || value === 1) { return true }
        return value && (
          value.type === "image/jpeg" ||
          value.type === "image/png" || 
          value.type === 'application/pdf'
        )
    }),
    aadhar_image_file: yup.mixed().required("Aadhar Image is a required field.")
    .test("type", "Only the following formats are accepted: .jpeg, .jpg, .png and .pdf", (value) => {
      if (value === null || value === 1) { return true }
        return value && (
          value.type === "image/jpeg" ||
          value.type === "image/png" || 
          value.type === 'application/pdf'
        )
    })
  })

  const store = useSelector(state => state.drivers)
  console.log(store)
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
    resolver: yupResolver(DriverSchema)
  })

  useEffect(() => {
    if (editMode) {
      console.log(data)
      setValue('name', data.attributes.name)
      setValue('driving_licence_number',  data.attributes.driving_licence_number ?? '')
      setValue('aadhar',  data.attributes.aadhar ?? '')
      setValue('email',  data.attributes.email ?? '')
      setValue('mobile',  data.attributes.mobile ?? '')
      setValue('dob', data.attributes.dob ?? '')
      setEmpDob(data.attributes.dob ?? '')
      setVcStatus(data.attributes.vaccinationstatus ?? 'No')
      setValue('vaccination_status',  data.attributes.vaccinationstatus ?? '')

      
      if (data.attributes.aadhar_image.data) {
        const aadhar_image = (data.attributes.aadhar_image.data) ? data.attributes.aadhar_image.data[0].attributes.url : ''
        const a_image = process.env.REACT_APP_IMAGEBASEURL + aadhar_image
        setAadharImagePreview(a_image)
        setValue('aadhar_image_file', 1)
      }
      if (data.attributes.driving_licence_image.data) {
        const dl_image = (data.attributes.driving_licence_image.data) ? data.attributes.driving_licence_image.data.attributes.url : ''
        const dlp_image = process.env.REACT_APP_IMAGEBASEURL + dl_image
        setDlImagePreview(dlp_image)
        setValue('dl_image_file', 1)
      }
      if (data.attributes.photo.data) {
        const pic_image = (data.attributes.photo.data) ? data.attributes.photo.data.attributes.url : ''
        const pci_image = process.env.REACT_APP_IMAGEBASEURL + pic_image
        setAvatarImagePreview(pci_image)
        setValue('avatar_image_file', 1)
      }
      if (data.attributes.vaccinationcertificate.data) {
        const vc_image = (data.attributes.vaccinationcertificate.data) ? data.attributes.vaccinationcertificate.data[0].attributes.url : ''
        const vcp_image = process.env.REACT_APP_IMAGEBASEURL + vc_image
        setVcImagePreview(vcp_image)
        setValue('vc_image_file', 1)
      }
    }
   
  }, [])

  /* const checkIsValid = edata => {
    const checkData = { ...edata }
      if (editMode) {
        delete checkData.aadhar_image_file
        delete checkData.dl_image_file
        delete checkData.vc_image_file
        delete checkData.avatar_image_file
      }
      return Object.values(checkData).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
  } */

  // ** Function to handle form submit
  const onSubmit = sdata => {
    //setData(data)
    /*sdata.aadhar_image_file = aadharImage ? aadharImage.name : ''
    sdata.dl_image_file = dlImage ? dlImage.name : ''
    sdata.vc_image_file = vcImage ? vcImage.name : ''
    sdata.avatar_image_file = avatarImage ? avatarImage.name : ''*/
    sdata.dob = empDob ? empDob : ''
    sdata.vaccination_status = vcStatus ? vcStatus : ''
    const contractor_uuid = localStorage.getItem('contractor_uuid')
    setInvalidDob(false)
   //if (checkIsValid(sdata)) {
    console.log(sdata)
      toggleSidebar()
      if (editMode) {
        return MySwal.fire({
          title: 'Are you sure?',
          text: "You want to update this driver!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Updated Driver!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1'
          },
          buttonsStyling: false
        }).then(function (result) {
          if (result.value) {
            dispatch(
              updateDriver({
                id: data.id,
                data: {
                  name: sdata.name,
                  dob: (empDob.constructor === Array) ? moment(empDob[0]).format("YYYY-MM-DD") : empDob,
                  driving_licence_number: sdata.driving_licence_number,
                  aadhar: sdata.aadhar,
                  //contractor: contractor_uuid,
                  email: sdata.email.toString().toLowerCase(),
                  mobile: sdata.mobile,
                  aadhar_image: aadharImage,
                  driving_licence_image: dlImage,
                  photo: avatarImage,
                  vaccinationstatus: vcStatus,
                  vaccinationcertificate: vcImage
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
          addDriver({
            name: sdata.name,
            dob: moment(empDob[0]).format("YYYY-MM-DD"),
            driving_licence_number: sdata.driving_licence_number,
            aadhar: sdata.aadhar,
            contractor: contractor_uuid,
            email: sdata.email.toString().toLowerCase(),
            mobile: sdata.mobile,
            aadhar_image: aadharImage,
            driving_licence_image: dlImage,
            photo: avatarImage,
            vaccinationstatus: vcStatus,
            vaccinationcertificate: vcImage
          })
        )
      }
    /*} else {
      for (const key in sdata) {
        if (key === 'dob') {
          setInvalidDob(true)
        }
        if (sdata[key] !== null && sdata[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }*/
  }
     
  const onAvatarFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setAvatarImage(file_value)
    setAvatarImagePreview(URL.createObjectURL(file_value))
    setValue('avatar_image_file', file_value)
  }
  const onDlFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setDlImage(file_value)
    setDlImagePreview(URL.createObjectURL(file_value))
    setValue('dl_image_file', file_value)
  }
  const onAadharFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setAadharImage(file_value)
    setAadharImagePreview(URL.createObjectURL(file_value))
    setValue('aadhar_image_file', file_value)
  }
  const onVcFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setVcImage(file_value)
    setVcImagePreview(URL.createObjectURL(file_value))
    setValue('vc_image_file', file_value)
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
      clearErrors(key)
    }
    setAvatarImage('')
    setAvatarImagePreview('')
    setValue('avatar_image_file', null)
    setDlImage('')
    setDlImagePreview('')
    setValue('dl_image_file', null)
    setAadharImage('')
    setAadharImagePreview('')
    setValue('aadhar_image_file', null)
    setVcImage('')
    setVcImagePreview('')
    setValue('vc_image_file', null)
    setEmpDob('')
    setVcStatus('No')
    setInvalidDob(false)
  }

  const handleStatusChange = newValue => {
    setValue('vaccination_status', newValue.value)
    setVcStatus(newValue.value)
  }

  /* const colourOptions = [
    { value: 'NO', label: 'No' },
    { value: 'Partial', label: 'Partial' },
    { value: 'Vaccinated', label: 'Fully' }
  ] */

  return (
    <Sidebar
      size='lg'
      open={open}
      title={editMode ? 'Edit Driver' : 'New Driver'}
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
          <Label className='form-label' for='mobile'>
            Contact Number <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='mobile'
            control={control}
            render={({ field }) => (
              <Input id='mobile' placeholder='(397) 294-5153' invalid={errors.mobile && true} {...field} />
            )}
          />
          {errors.mobile && (
            <FormFeedback className='d-block'>{errors.mobile.message}</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='dob'>
           DOB <span className='text-danger'>*</span>
          </Label>
            <Flatpickr
                value={empDob}
                id='range-picker'
                className={`form-control ${(invalidDob) ? 'is-invalid' : ''}`}
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
          <Label className='form-label' for='vaccination_status'>
          Vaccination Status <span className='text-danger'>*</span>
          </Label>
          <Select
              className={`react-select ${(errors.vaccination_status) ? 'is-invalid' : ''}`}
              classNamePrefix='select'
              defaultValue={store.vaccination_status.filter(option => option.value === vcStatus)}
              options={store.vaccination_status}
              isClearable={false}
              onChange={handleStatusChange}
              name='vaccination_status'
            />
        </div>
       
        <div className='mb-1'>
          <Label className='form-label' for='vc_image_file'>
            Vaccination Certificate <span className='text-danger'>*  [Allowed JPG, PNG or PDF]</span>
          </Label>
          <Input id='vc_image_file' type="file" placeholder='Enter GST Number' invalid={errors.vc_image_file && true} onChange={onVcFileChange} />
           
          {errors.vc_image_file && (
            <FormFeedback className='d-block'>{errors.vc_image_file.message}</FormFeedback>
          )}
          { vcImagePreview ? <div className='mt-1'><img src={vcImagePreview} width="150" height="150"/></div> : ''}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='aadhar'>
            Aadhar Number <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='aadhar'
            control={control}
            render={({ field }) => (
              <Input id='aadhar' placeholder='' invalid={errors.aadhar && true} {...field} />
            )}
          />
           {errors.aadhar && (
            <FormFeedback className='d-block'>{errors.aadhar.message}</FormFeedback>
          )}
        </div>
       
        <div className='mb-1'>
          <Label className='form-label' for='aadhar_image_file'>
            Aadhar Image <span className='text-danger'>* [Allowed JPG, PNG or PDF]</span>
          </Label>
          <Input id='aadhar_image_file' type="file" placeholder='Enter GST Number' invalid={errors.aadhar_image_file && true} onChange={onAadharFileChange} />
         
          {errors.aadhar_image_file && (
            <FormFeedback className='d-block'>{errors.aadhar_image_file.message}</FormFeedback>
          )}
          { aadharImagePreview ? <div className='mt-1'><img src={aadharImagePreview} width="150" height="150"/></div> : ''}
        </div> 
        <div className='mb-1'>
          <Label className='form-label' for='driving_licence_number'>
            Driving Licence Number <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='driving_licence_number'
            control={control}
            render={({ field }) => (
              <Input id='driving_licence_number' placeholder='John Doe' invalid={errors.driving_licence_number && true} {...field} />
            )}
          />
          {errors.driving_licence_number && (
            <FormFeedback className='d-block'>{errors.driving_licence_number.message}</FormFeedback>
          )}
        </div>
      
        <div className='mb-1'>
          <Label className='form-label' for='dl_image_file'>
            Driving Licence <span className='text-danger'>* [Allowed JPG, PNG or PDF]</span>
          </Label>
          <Input id='dl_image_file' type="file" placeholder='Enter GST Number' invalid={errors.dl_image_file && true} onChange={onDlFileChange} />
          {errors.dl_image_file && (
            <FormFeedback className='d-block'>{errors.dl_image_file.message}</FormFeedback>
          )}
          { dlImagePreview ? <div className='mt-1'><img src={dlImagePreview} width="150" height="150"/></div> : ''}
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
