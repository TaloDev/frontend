import api from './api'

export default async (apiKeyId) => api.delete(`/api-keys/${apiKeyId}`)
