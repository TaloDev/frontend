import api from './api'

export default (code, userId) => api.post('/public/users/2fa', { code, userId })
