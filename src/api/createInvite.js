import api from './api'

export default (email, type) => api.post('/invites', { email, type })
