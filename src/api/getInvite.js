import api from './api'

export default (token) => api.get(`/public/invites/${token}`)
