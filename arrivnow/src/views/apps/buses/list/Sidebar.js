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
import { addBus, updateBus } from '../store'
import { useDispatch } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const defaultValues = {
  vehicle_number: '',
  vehicle_color: '',
  seating_capacity: '',
  rc_image_file: null,
  puc_number: '',
  puc_image_file: null,
  fitness_image_file: null
}

const MySwal = withReactContent(Swal)

const SidebarNewUsers = ({ open, toggleSidebar, editMode, data }) => {
  // ** States
  //const [data, setData] = useState(null)
  const [rcImage, setRcImage] = useState(null)
  const [rcImagePreview, setRcImagePreview] = useState(null)
  const [pucImage, setPUCImage] = useState(null)
  const [pucImagePreview, setPUCImagePreview] = useState(null)
  const [fitnessImage, setFitnessImage] = useState(null)
  const [fitnessImagePreview, setFitnessImagePreview] = useState(null)
  // ** Store Vars
  const dispatch = useDispatch()
  const BusSchema = yup.object().shape({
    vehicle_number: yup.string().required("Vehicle Number is a required field."),
    vehicle_color: yup.string()
      .required("Vehicle Colour is a required field.")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field."),
    seating_capacity: yup
      .string()
      .required("Seating Capacity is a required field.")
      .matches(/^[0-9]+$/, "Only numbers are allowed for this field."), 
    puc_number: yup.string().required("PUC Number is a required field."),
    rc_image_file: yup.mixed().required("RC Certificate is a required field.")
      .test("type", "Only the following formats are accepted: .jpeg, .jpg, .png and .pdf", (value) => {
        if (value === null || value === 1) { return true }
          return value && (
            value.type === "image/jpeg" ||
            value.type === "image/png" ||
            value.type === 'application/pdf'
          )
      }),
      puc_image_file: yup.mixed().required("PUC Certificate is a required field.")
    .test("type", "Only the following formats are accepted: .jpeg, .jpg, .png and .pdf", (value) => {
      if (value === null || value === 1) { return true }
        return value && (
          value.type === "image/jpeg" ||
          value.type === "image/png" || 
          value.type === 'application/pdf'
        )
    }),
    fitness_image_file: yup.mixed().required("Fitness Certificate is a required field.")
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
    resolver: yupResolver(BusSchema)
  })

  useEffect(() => {
    if (editMode) {
      setValue('vehicle_number', data.attributes.vehicle_number)
      setValue('vehicle_color',  data.attributes.colour)
      setValue('seating_capacity',  data.attributes.seating_capacity.toString())
      setValue('puc_number',  data.attributes.puc)

      if (data.attributes.rc_certificate.data) {
        const aadhar_image = (data.attributes.rc_certificate.data) ? data.attributes.rc_certificate.data[0].attributes.url : ''
        const a_image = process.env.REACT_APP_IMAGEBASEURL + aadhar_image
        setRcImagePreview(a_image)
        setValue('rc_image_file', 1)
      }
      if (data.attributes.puccertificate.data) {
        const dl_image = (data.attributes.puccertificate.data) ? data.attributes.puccertificate.data.attributes.url : ''
        const dlp_image = process.env.REACT_APP_IMAGEBASEURL + dl_image
        setPUCImagePreview(dlp_image)
        setValue('puc_image_file', 1)
      }
      if (data.attributes.fitnesscertificate.data) {
        const pic_image = (data.attributes.fitnesscertificate.data) ? data.attributes.fitnesscertificate.data[0].attributes.url : ''
        const pci_image = process.env.REACT_APP_IMAGEBASEURL + pic_image
        setFitnessImagePreview(pci_image)
        setValue('fitness_image_file', 1)
      }
    }

  }, [])

  /* const checkIsValid = data => {
    const checkData = { ...data }
    delete checkData.any_major_accident
    delete checkData.any_police_complaint
    
    if (editMode) {
      delete checkData.rc_image_file
      delete checkData.puc_image_file
      delete checkData.fitness_image_file
    }
  
    return Object.values(checkData).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
  } */

  // ** Function to handle form submit
  const onSubmit = sdata => {
    //setData(data)
    /*sdata.rc_image_file = rcImage ? rcImage.name : ''
    sdata.puc_image_file = pucImage ? pucImage.name : ''
    sdata.fitness_image_file = fitnessImage ? fitnessImage.name : '' */
    const contractor_uuid = localStorage.getItem('contractor_uuid')
    console.log(sdata)
  // if (checkIsValid(sdata)) {
      toggleSidebar()
      if (editMode) {
        return MySwal.fire({
          title: 'Are you sure?',
          text: "You want to update this bus!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Updated Bus!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1'
          },
          buttonsStyling: false
        }).then(function (result) {
          if (result.value) {
            dispatch(
              updateBus({
                id: data.id,
                data: {vehicle_number: sdata.vehicle_number,
                  colour: sdata.vehicle_color,
                  seating_capacity: sdata.seating_capacity,
                  puc: sdata.puc_number,
                  rc_certificate: rcImage,
                  puccertificate: pucImage,
                  fitnesscertificate: fitnessImage
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
          addBus({
            status: 'pending',
            vehicle_number: sdata.vehicle_number,
            colour: sdata.vehicle_color,
            seating_capacity: sdata.seating_capacity,
            contractor: contractor_uuid,
            puc: sdata.puc_number,
            rc_certificate: rcImage,
            puccertificate: pucImage,
            fitnesscertificate: fitnessImage
          })
        )
      }
    /* } else {
      for (const key in sdata) {
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
    setRcImage('')
    setRcImagePreview('')
    setValue('rc_image_file', null)
    setPUCImage('')
    setPUCImagePreview('')
    setValue('puc_image_file', null)
    setFitnessImage('')
    setFitnessImagePreview('')
    setValue('fitness_image_file', null)
  }

  const onRcFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setRcImage(file_value)
    setRcImagePreview(URL.createObjectURL(file_value))
    setValue('rc_image_file', file_value)
  }

  const onPUCFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setPUCImage(file_value)
    setPUCImagePreview(URL.createObjectURL(file_value))
    setValue('puc_image_file', file_value)
  }

  const onFitnessFileChange = event => { 
    // Update the state 
    const file_value = event.target.files[0] 
    setFitnessImage(file_value)
    setFitnessImagePreview(URL.createObjectURL(file_value))
    setValue('fitness_image_file', file_value)
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title={editMode ? 'Edit Bus' : 'New Bus'}
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='vehicle_number'>
          Vehicle Number <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='vehicle_number'
            control={control}
            render={({ field }) => (
              <Input id='vehicle_number' placeholder='Eg.VXD547' invalid={errors.vehicle_number && true} {...field} />
            )}
          />
          {errors.vehicle_number && (
            <FormFeedback className='d-block'>{errors.vehicle_number.message}</FormFeedback>
          )}
        </div>
        
        <div className='mb-1'>
          <Label className='form-label' for='vehicle_color'>
          Vehicle Colour<span className='text-danger'>*</span>
          </Label>
          <Controller
            name='vehicle_color'
            control={control}
            render={({ field }) => (
              <Input
                type='vehicle_color'
                id='vehicle_color'
                placeholder='Eg. White'
                invalid={errors.vehicle_color && true}
                {...field}
              />
            )}
          />
          {errors.vehicle_color && (
            <FormFeedback className='d-block'>{errors.vehicle_color.message}</FormFeedback>
          )}
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='seating_capacity'>
          Seating Capacity <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='seating_capacity'
            control={control}
            render={({ field }) => (
              <Input id='seating_capacity' type="number" placeholder='Enter bus capacity' invalid={errors.seating_capacity && true} {...field} />
            )}
          />
          {errors.seating_capacity && (
            <FormFeedback className='d-block'>{errors.seating_capacity.message}</FormFeedback>
          )}
        </div> 
        <div className='mb-1'>
          <Label className='form-label' for='puc_number'>
          PUC Number <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='puc_number'
            control={control}
            render={({ field }) => (
              <Input id='puc_number' invalid={errors.puc_number && true} {...field} />
            )}
          />
          {errors.puc_number && (
            <FormFeedback className='d-block'>{errors.puc_number.message}</FormFeedback>
          )}
        </div> 
       
        <div className='mb-1'>
          <Label className='form-label' for='puc_image_file'>
          PUC Certificate <span className='text-danger'>*</span>
          </Label>
          <Input id='puc_image_file' type="file" placeholder='Enter GST Number' invalid={errors.puc_image_file && true} onChange={onPUCFileChange} />
          
          {errors.puc_image_file && (
            <FormFeedback className='d-block'>{errors.puc_image_file.message}</FormFeedback>
          )}
          { pucImagePreview ? <div className='mt-1'><img src={pucImagePreview} width="150" height="150"/></div> : ''}
        </div>
        
        <div className='mb-1'>
          <Label className='form-label' for='rc_image_file'>
          RC Certificate <span className='text-danger'>*</span>
          </Label>
          <Input id='rc_image_file' type="file" placeholder='Enter GST Number' invalid={errors.rc_image_file && true} onChange={onRcFileChange} />
          
          {errors.rc_image_file && (
            <FormFeedback className='d-block'>{errors.rc_image_file.message}</FormFeedback>
          )}
          { rcImagePreview ? <div className='mt-1'><img src={rcImagePreview} width="150" height="150"/></div> : ''}
        </div>
        
        <div className='mb-1'>
          <Label className='form-label' for='fitness_image_file'>
          Fitness Certificate <span className='text-danger'>*</span>
          </Label>
          <Input id='fitness_image_file' type="file" placeholder='Enter GST Number' invalid={errors.fitness_image_file && true} onChange={onFitnessFileChange} />
          
          {errors.fitness_image_file && (
            <FormFeedback className='d-block'>{errors.fitness_image_file.message}</FormFeedback>
          )}
          { fitnessImagePreview ? <div className='mt-1'><img src={fitnessImagePreview} width="150" height="150"/></div> : ''}
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
