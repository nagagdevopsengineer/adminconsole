// ** React Imports
import { Link, useLocation, useHistory } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Icons Imports
import { ChevronLeft } from 'react-feather'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'
// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Button, FormFeedback } from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const defaultValues = {
  newPassword: '',
  retypeNewPassword: ''
}


const MySwal = withReactContent(Swal)
const handleClickMsg = (title, msg, icon) => {
  return MySwal.fire({
    title,
    text: msg,
    icon,
    customClass: {
      confirmButton: 'btn btn-primary'
    }
  })
}
const ResetPasswordBasic = () => {
  const history = useHistory()
  const search = useLocation().search
  const key = new URLSearchParams(search).get('key')
  if (!key) {
    history.push('/login')
  }
  const SignupSchema = yup.object().shape({
    newPassword: yup
      .string()
      .min(8, obj => showErrors('New Password', obj.value.length, obj.min))
      .required(),
    retypeNewPassword: yup
      .string()
      .min(8, obj => showErrors('Retype New Password', obj.value.length, obj.min))
      .required()
      .oneOf([yup.ref(`newPassword`), null], 'Passwords must match')
  })
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema)
  })

  const logo_source = require('@src/assets/images/logo/arriv_logo.jpg').default
  const onSubmit = data => {
    console.log(data)
     if (Object.values(data).every(field => field.length > 0)) {
      axios.post("http://ec2-18-208-170-73.compute-1.amazonaws.com:8081/api/users/reset-password/finish", {key, newPassword: data.newPassword})
        .then(response => {
          console.log(response)
          handleClickMsg('Done', 'Your password has been changed. Please try again.', 'success')
        })
        .catch(err => {
          console.log(err)
          handleClickMsg('Error', 'Something went wrong. Please try again.', 'error')
        })
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual',
            message: `Please enter a valid ${key}`
          })
        }
      }
    }
  }

  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
               <img className='img-fluid' src={logo_source} alt='Arrivnow Logo' width="150px"/>
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Reset Password 🔒
            </CardTitle>
            <CardText className='mb-2'>Your new password must be different from previously used passwords</CardText>
            <Form className='auth-reset-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Controller
                  control={control}
                  id='newPassword'
                  name='newPassword'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='New Password'
                      htmlFor='newPassword'
                      className='input-group-merge'
                      invalid={errors.newPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.newPassword && <FormFeedback className='d-block'>{errors.newPassword.message}</FormFeedback>}
              </div>
              <div className='mb-1'>
                <Controller
                    control={control}
                    id='retypeNewPassword'
                    name='retypeNewPassword'
                    render={({ field }) => (
                      <InputPasswordToggle
                        label='Retype New Password'
                        htmlFor='retypeNewPassword'
                        className='input-group-merge'
                        invalid={errors.newPassword && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.retypeNewPassword && (
                    <FormFeedback className='d-block'>{errors.retypeNewPassword.message}</FormFeedback>
                  )}
              </div>
              <Button color='primary' block>
                Set New Password
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <Link to='/login'>
                <ChevronLeft className='rotate-rtl me-25' size={14} />
                <span className='align-middle'>Back to login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordBasic
