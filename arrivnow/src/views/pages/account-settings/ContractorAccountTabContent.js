// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import Select from 'react-select'
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'
import { updateContractor, updateContractorLogo } from '@src/views/apps/contractors/store'
import { useDispatch } from 'react-redux'
import 'cleave.js/dist/addons/cleave-phone.us'

// ** Reactstrap Imports
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'

// ** Utils
// import { selectThemeColors } from '@utils'

// ** Demo Components
import DeleteAccount from './DeleteAccount'

/* const countryOptions = [
  { value: 'uk', label: 'UK' },
  { value: 'usa', label: 'USA' },
  { value: 'france', label: 'France' },
  { value: 'russia', label: 'Russia' },
  { value: 'canada', label: 'Canada' }
] */

const ContractorAccountTabs = ({ data }) => {
  const dispatch = useDispatch()
  const [imageError, setImageError] = useState('')
  // ** Hooks
  const defaultValues = {
    name: data.attributes.name ?? '',
    gst_Number: data.attributes.gst ?? '',
    email: data.attributes.email ?? '',
    reg_number: data.attributes.reg_number ?? '',
    contactNumber: data.attributes.contactnumber ?? '',
    uuid: data.attributes.uuid
  }
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** States
  const user_image = (data.attributes.photo.data) ? data.attributes.photo.data.attributes.url : ''
  const [avatar, setAvatar] = useState(user_image ? process.env.REACT_APP_IMAGEBASEURL + user_image : require('@src/assets/images/avatars/avatar-blank.png').default)

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
          updateContractorLogo({
            id: data.id,
            data: { 
              photo: files[0]}
          })
        )
      } else {
        setImageError('Only Allowed .JPG or .PNG ')
      }
  }

  const onSubmit = sdata => {
    console.log(sdata)
    if (Object.values(sdata).every(field => field.length > 0)) {
      dispatch(
        updateContractor({
          id: data.id,
          data: { 
            email: sdata.email,
            uuid: sdata.uuid,
            reg_number: sdata.reg_number,
            name: sdata.name,
            gst: sdata.gst_Number,
            gst_url: '',
            contactNumber: sdata.contactNumber
          }
        })
      )
    } else {
      for (const key in sdata) {
        if (sdata[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  /* const handleImgReset = () => {
    setAvatar(require('@src/assets/images/avatars/avatar-blank.png').default)
  } */
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
                <p className='mb-0'>Allowed JPG, GIF or PNG. Max size of 800kB</p>
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
                {errors && errors.name && <FormFeedback>Please enter a valid Name</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='emailInput'>
                  E-mail
                </Label>
                <Input id='emailInput' readOnly type='email' name='email' placeholder='Email' defaultValue={data.attributes.email} />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='phNumber'>
                  Contact Number
                </Label>
                <Controller
                  name='contactNumber'
                  control={control}
                  render={({ field }) => (
                    <Input id='contactNumber' placeholder='' invalid={errors.contactNumber && true} {...field} />
                  )}
                />
                {errors && errors.contactNumber && <FormFeedback>Please enter a Contact Number</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='reg_number'>
                Registration Number 
                </Label>
                <Controller
                  name='reg_number'
                  control={control}
                  render={({ field }) => (
                    <Input id='reg_number' placeholder='' invalid={errors.reg_number && true} {...field} />
                  )}
                />
                {errors && errors.reg_number && <FormFeedback>Please enter a Registration Number</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='gst_number'>
                GST Number
                </Label>
                <Controller
                  name='gst_Number'
                  control={control}
                  render={({ field }) => (
                    <Input id='gst_Number' placeholder='' invalid={errors.gst_Number && true} {...field} />
                  )}
                />
                {errors && errors.gst_Number && <FormFeedback>Please enter a GST Number</FormFeedback>}
              </Col>
              <Col className='mt-2' sm='12'>
                <Button type='submit' className='me-1' color='primary'>
                  Save changes
                </Button>
                <Button type='button' color='secondary' outline onClick={() => reloadPage()}>
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

export default ContractorAccountTabs
