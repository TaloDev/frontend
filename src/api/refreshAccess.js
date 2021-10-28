import axios from 'axios'
import AuthService from '../services/AuthService'
import { apiConfig } from './api'

export default async () => {
  const api = axios.create(apiConfig)

  api.interceptors.response.use((response) => {
    return response
  }, (error) => {
    if (AuthService.getToken() && error.response?.status === 401) AuthService.reload()
    return Promise.reject(error)
  })

  return api.get('/public/users/refresh')
}
