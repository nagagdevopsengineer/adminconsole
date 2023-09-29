// ** React Import
//import { useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Third Party Components

import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input } from 'reactstrap'

// ** Store & Actions
//import { addClient } from '../store'
//import { useDispatch } from 'react-redux'

const defaultValues = {
  email: '',
  contact: '',
  vaccine_certificate: '',
  fullName: '',
  aadhar_card:'',
  police_verification_doc: '',
  driving_license: ''
}

const checkIsValid = data => {
  return Object.values(data).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
}

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
  //const [data, setData] = useState(null)

  // ** Store Vars
  //const dispatch = useDispatch()

  // ** Vars
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = data => {
    //setData(data)
    if (checkIsValid(data)) {
      console.log(true)
    }
   /* if (checkIsValid(data)) {
      toggleSidebar()
      dispatch(
        addUser({
          avatar: '',
          status: 'active',
          email: data.email,
          company: data.company,
          contact: data.contact,
          fullName: data.fullName,
          gst_number: data.gst_number.value
        })
      )
    } else {
      for (const key in data) {
        
        if (data[key] !== null && data[key].length === 0) {
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
    }
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title='New Driver'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='fullName'>
            Full Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='fullName'
            control={control}
            render={({ field }) => (
              <Input id='fullName' placeholder='John Doe' invalid={errors.fullName && true} {...field} />
            )}
          />
        </div>
        
        <div className='mb-1'>
          <Label className='form-label' for='aadhar_card'>
          Aadhar Card<span className='text-danger'>*</span>
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                type='file'
                id='aadhar_card'
                className="form-control"
                invalid={errors.aadhar_card && true}
                {...field}
              />
            )}
          />
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='vaccine_certificate'>
          Vaccination Certificate <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='vaccine_certificate'
            control={control}
            render={({ field }) => (
              <Input type='file' id='vaccine_certificate' className="form-control" invalid={errors.vaccine_certificate && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='police_verification_doc'>
          Police verification <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='police_verification_doc'
            control={control}
            render={({ field }) => (
              <Input type='file' id='police_verification_doc' className="form-control" invalid={errors.police_verification_doc && true} {...field} />
            )}
          />
        </div> 
        <div className='mb-1'>
          <Label className='form-label' for='driving_license'>
          Driving Licence <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='driving_license'
            control={control}
            render={({ field }) => (
              <Input type='file' id='driving_license' className="form-control" invalid={errors.driving_license && true} {...field} />
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
