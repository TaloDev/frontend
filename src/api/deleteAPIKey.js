import api from './api'

export default (apiKeyId) => api.delete(`/api-keys/${apiKeyId}`)
