import api from './api'

export default (password) => api.post('/users/2fa/disable', { password })
