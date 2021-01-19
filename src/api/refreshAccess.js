import axios from 'axios'
import { apiConfig } from './api'

export default async () => {
  const api = axios.create(apiConfig)
  return api.get('/public/users/refresh')
}
