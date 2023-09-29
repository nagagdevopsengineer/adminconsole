// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import Select from 'react-select'
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'
import { updateClient, updateClientLogo } from '@src/views/apps/clients/store'
import { useDispatch } from 'react-redux'
import 'cleave.js/dist/addons/cleave-phone.us'

// ** Reactstrap Imports
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'

// ** Utils
//import { selectThemeColors } from '@utils'

const ClientAccountTabs = ({ data }) => {
 
  const user_image = (data.attributes.logo.data) ? data.attributes.logo.data[0].attributes.url : ''
  const dispatch = useDispatch()
  const [imageError, setImageError] = useState('')
  const [avatar, setAvatar] = useState(user_image ? process.env.REACT_APP_IMAGEBASEURL + user_image : require('@src/assets/images/avatars/avatar-blank.png').default)
  //const [avatarData, setAvatarData] = useState('')
  // ** Hooks
  const defaultValues = {
    name: data.attributes.name,
    gstnumber: data.attributes.gstnumber,
    email: data.attributes.email,
    registration_number: data.attributes.registration_number,
    uuid: data.id,
    contact: data.attributes.mobile,
    address: data.attributes.address,
    company_name: data.attributes.companyname
  }
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = sdata => {
    if (sdata.name && sdata.email) {

      console.log(sdata)
      dispatch(
        updateClient({
          id: sdata.uuid,
          data: { 
          name: sdata.name,
          email: sdata.email,
          registration_number: sdata.registration_number,
          gstnumber: sdata.gstnumber,
          address: sdata.address,
          companyname: sdata.company_name}
        })
      )
    } else {
      for (const key in sdata) {
       
        if (sdata[key].length === 0) {
          console.log(key)
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  /* const handleImgReset = () => {
    setAvatar(require('@src/assets/images/avatars/avatar-blank.png').default)
    dispatch(
      updateClientLogo({
        id: data.id,
        data: { 
          logo: ''}
      })
    ) 
  }*/
  const fileTypes = ['jpg', 'jpeg', 'png']
  const onChange = e => {
    const reader = new FileReader(),
      files = e.target.files
      const extension = files[0].name.split('.').pop().toLowerCase()
      const isSuccess = fileTypes.indexOf(extension) > -1
      if (isSuccess) {
        reader.onload = function () {
          setAvatar(reader.result)
        }
        reader.readAsDataURL(files[0])
        setImageError('')
        dispatch(
          updateClientLogo({
            id: data.id,
            data: { 
              logo: files[0]}
          })
        )
      } else {
        setImageError('Only Allowed .JPG or .PNG ')
      }


  }

  const reloadPage = () => {
    window.location.reload(false)
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Profile Details</CardTitle>
        </CardHeader>
        <CardBody className='py-2 my-25'>
        <div className='d-flex'>
            <div className='me-25'>
              <img className='rounded me-50' src={avatar} alt='Generic placeholder image' height='100' width='100' />
            </div>
            <div className='d-flex align-items-end mt-75 ms-1'>
              <div>
                <p className='alert alert-danger'>{imageError}</p>
                <Button tag={Label} className='mb-75 me-75' size='sm' color='primary'>
                  Upload
                  <Input type='file' onChange={onChange} hidden accept='image/*' />
                </Button>
                {/*<Button className='mb-75' color='secondary' size='sm' outline onClick={handleImgReset}>
                  Reset
                </Button>*/}
                <p className='mb-0'>Allowed JPG or PNG.</p>
              </div>
            </div>
          </div>
          <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='name'>
                   Name
                </Label>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <Input id='name' placeholder='John' invalid={errors.name && true} {...field} />
                  )}
                />
                {errors && errors.name && <FormFeedback>Please enter a Name</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='emailInput'>
                  E-mail
                </Label>
                <Input id='emailInput' readOnly type='email' name='email' placeholder='Email' defaultValue={data.attributes.email} />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='contact'>
                Contact Number
                </Label>
                <Controller
                  name='contact'
                  control={control}
                  render={({ field }) => (
                    <Input id='contact' placeholder='' invalid={errors.contact && true} {...field} />
                  )}
                />
                {errors && errors.contact && <FormFeedback>Please enter a Contact Number</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
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
                {errors && errors.company_name && <FormFeedback>Please enter a Company Name</FormFeedback>}
             </Col>
              <Col sm='6' className='mb-1'>
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
                {errors && errors.address && <FormFeedback>Please enter a Address</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='registration_number'>
                Registration Number 
                </Label>
                <Controller
                  name='registration_number'
                  control={control}
                  render={({ field }) => (
                    <Input id='registration_number' placeholder='' invalid={errors.registration_number && true} {...field} />
                  )}
                />
                {errors && errors.registration_number && <FormFeedback>Please enter a Registration Number</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='gstnumber'>
                GST Number
                </Label>
                <Controller
                  name='gstnumber'
                  control={control}
                  render={({ field }) => (
                    <Input id='gstnumber' placeholder='' invalid={errors.gstnumber && true} {...field} />
                  )}
                />
                {errors && errors.gstnumber && <FormFeedback>Please enter a GST Number</FormFeedback>}
              </Col>
              <Col className='mt-2' sm='12'>
                <Button type='submit' className='me-1' color='primary'>
                  Save changes
                </Button>
                <Button type="button" color='secondary' outline onClick={() => reloadPage()}>
                  Discard
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default ClientAccountTabs
