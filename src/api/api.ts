import axios from 'axios'
import AuthService from '../services/AuthService'
import refreshAccess from './refreshAccess'

export const apiConfig = {
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL
}

const instance = axios.create(apiConfig)

instance.interceptors.request.use((config) => {
  if (AuthService.getToken()) {
    config.headers['Authorization'] = `Bearer ${AuthService.getToken()}`
  }

  const includeDevData = (window.localStorage.getItem('includeDevDataOptimistic') ??
    window.localStorage.getItem('includeDevData')) === 'true'

  config.headers['X-Talo-Include-Dev-Data'] = includeDevData ? '1' : '0'

  return config
}, (error) => Promise.reject(error)
)

instance.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const request = error.config

  if (!request.url.startsWith('/public')) {
    if (error.response?.status === 401 && !request._retry) {
      request._retry = true

      const { accessToken } = await refreshAccess()
      const newToken = accessToken

      AuthService.setToken(newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

      return instance(request)
    } else if (error.response?.status === 401 && request._retry) {
      AuthService.reload()
    }
  }

  return Promise.reject(error)
})

export default instance
