import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const resetPassword = makeValidatedRequest(
  (token: string, password: string) => api.post('/public/users/reset_password', { token, password }),
  z.literal('')
)

export default resetPassword
