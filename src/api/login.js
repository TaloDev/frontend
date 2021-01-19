import api from './api'

export default async (data) => api.post('/public/users/login', data)
