import api from './api'

export default async (data) => api.post('/leaderboards', data)
