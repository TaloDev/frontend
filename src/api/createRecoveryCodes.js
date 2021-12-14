import api from './api'

export default (password) => api.post('/users/2fa/recovery_codes/create', { password })
