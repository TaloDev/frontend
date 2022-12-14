import api from './api'

export default (token, password) => api.post('/public/users/reset_password', { token, password })
