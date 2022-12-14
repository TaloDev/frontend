import api from './api'

export default (email) => api.post('/public/users/forgot_password', { email })
