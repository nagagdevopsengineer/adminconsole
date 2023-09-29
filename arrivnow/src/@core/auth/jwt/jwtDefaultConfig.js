// ** Auth Endpoints
export default {
 // loginEndpoint: '/jwt/login',
  loginEndpoint: 'http://ec2-18-208-170-73.compute-1.amazonaws.com:8081/api/users/authenticate',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: '/jwt/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
