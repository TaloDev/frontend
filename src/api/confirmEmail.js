import api from './api'

export default async (code) => api.post('/users/confirm_email', { code })
