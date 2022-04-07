import api from './api'

export default (data) => api.post('/public/users/register', data)
