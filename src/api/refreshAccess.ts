import axios from 'axios'
import { z } from 'zod'
import { userSchema } from '../entities/user'
import AuthService from '../services/AuthService'
import { apiConfig } from './api'
import makeValidatedRequest from './makeValidatedRequest'

const refreshAccess = makeValidatedRequest(
  () => {
    const api = axios.create(apiConfig)

    api.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (AuthService.getToken() && error.response?.status === 401) AuthService.reload()
        return Promise.reject(error)
      },
    )

    return api.get('/public/users/refresh')
  },
  z.object({
    accessToken: z.string(),
    user: userSchema,
  }),
)

export default refreshAccess
