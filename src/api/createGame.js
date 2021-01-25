import api from './api'

export default async (name) => api.post('/games', { name })
