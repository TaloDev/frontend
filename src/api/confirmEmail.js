import api from './api'

export default (code) => api.post('/users/confirm_email', { code })
