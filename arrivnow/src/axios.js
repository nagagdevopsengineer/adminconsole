import axios from 'axios'
const instance = axios.create({baseURL: 'http://ec2-18-208-170-73.compute-1.amazonaws.com:1337'})
export default instance