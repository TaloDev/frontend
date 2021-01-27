import api from './api'

export default async (game) => api.get(`/players?game=${game}`)
