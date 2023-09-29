// ** React Imports
import { useContext, Fragment } from 'react'
//import { Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import axiosObj from '@src/axios'
// ** Third Party Components
import { useDispatch } from 'react-redux'
import { toast, Slide } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee } from 'react-feather'

// ** Actions
import { handleLogin } from '@store/authentication'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'

// ** Reactstrap Imports
import { Row, Col, Form, Input, Label, Alert, Button, CardText, CardTitle, UncontrolledTooltip } from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title fw-bold'>Welcome, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>You have successfully logged in as an {role} user to Arrivnow. Now you can start to explore. Enjoy!</span>
    </div>
  </Fragment>
)

const defaultValues = {
  password: 'admin',
  loginEmail: 'admin@demo.com'
}

const Login = () => {
  // ** Hooks
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const history = useHistory()
  const ability = useContext(AbilityContext)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })
  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'arrivnow.bg.webp',
    source = require(`@src/assets/images/pages/${illustration}`).default,
    logo_source = require('@src/assets/images/logo/arriv_logo.jpg').default

  const handleUserData = (res, role, user_id, user) => {
    console.log(user)
    let avatar = ''
    let user_image = ''
    if (role === 'client') {
      user_image = (user && user.attributes.logo.data) ? user.attributes.logo.data[0].attributes.url : ''
    } else {
      user_image = (user && user.attributes.photo.data) ? user.attributes.photo.data.attributes.url : ''
    } 
    
    if (user_image) {
      avatar = process.env.REACT_APP_IMAGEBASEURL + user_image
    }
    const userData = {
      id: user_id,
      fullName: (user !== '') ? user.attributes.name : 'Rajeev',
      avatar,
      role,
      status: (user !== '') ? user.attributes.status : '',
      ability: [
        {
          action:"manage",
          subject:"all"
        }
      ]
    }
    const data = { userData, accessToken: res.data.token.id_token, refreshToken: res.data.token.id_token }
    dispatch(handleLogin(data))
    ability.update(data.userData.ability)
    history.push(getHomeRouteForLoggedInUser(data.userData.role))
    toast.success(
      <ToastContent name={userData.fullName || data.username || 'John Doe'} role={userData.role || 'admin'} />,
      { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
    )
  }  

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      useJwt
        //.login({ email: data.loginEmail, password: data.password })
        .login({ username: data.loginEmail, password: data.password })
        .then(res => {
          let role = "admin"
          let user_id = res.data.userId
          if (res.data.roles[0] === "ROLE_CLIENT") {
            axiosObj.get(`/api/clients/?filters[uuid]=${res.data.userId}&populate=*`)
            .then(response => {
              user_id = response.data.data[0].id
              localStorage.setItem('client_uuid', user_id)
              role = "client"

              handleUserData(res, role, user_id, response.data.data[0])
            })
          } else if (res.data.roles[0] === "ROLE_CONTRACTOR") {
            axiosObj.get(`/api/contractors/?filters[uuid]=${res.data.userId}&populate=*`)
            .then(response => {
              user_id = response.data.data[0].id
              localStorage.setItem('contractor_uuid', user_id)
              role = "contractor"

              handleUserData(res, role, user_id, response.data.data[0])
            })
          } else if (res.data.roles[0] === "ROLE_ADMIN") {
            user_id = res.data.userId
            handleUserData(res, role, user_id, '')
          }
        })
        .catch(err => console.log(err))
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
        <img className='img-fluid' src={logo_source} alt='Arrivnow Logo' width="150px"/>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Welcome to Arrivnow! 👋
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>
            <Alert color='primary'>
              <div className='alert-body font-small-2'>
                <p>
                  <small className='me-50'>
                    <span className='fw-bold'>Admin:</span> admin@demo.com | admin
                  </small>
                </p>
                <p>
                  <small className='me-50'>
                    <span className='fw-bold'>Client:</span> client@demo.com | client
                  </small>
                </p>
              </div>
              <HelpCircle
                id='login-tip'
                className='position-absolute'
                size={18}
                style={{ top: '10px', right: '10px' }}
              />
              <UncontrolledTooltip target='login-tip' placement='left'>
                This is just for ACL demo purpose.
              </UncontrolledTooltip>
            </Alert>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Controller
                  id='loginEmail'
                  name='loginEmail'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='email'
                      placeholder='john@example.com'
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div>
              <Button type='submit' color='primary' block>
                Sign in
              </Button>
            </Form>
            { /* <p className='text-center mt-2'>
              <span className='me-25'>New on our platform?</span>
              <Link to='/register'>
                <span>Create an account</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button color='google'>
                <Mail size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
                  </div> */ }
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
