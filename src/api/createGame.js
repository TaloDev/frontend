import api from './api'

export default (name) => api.post('/games', { name })
