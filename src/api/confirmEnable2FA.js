import api from './api'

export default (code) => api.post('/users/2fa/enable', { code })
