import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { userSchema } from '../entities/user'

const twoFactorAuthResponseSchema = z.object({
  twoFactorAuthRequired: z.literal(true),
  userId: z.number()
})

const loginSuccessResponseSchema = z.object({
  accessToken: z.string(),
  user: userSchema
})

const login = makeValidatedRequest(
  (data: { email: string, password: string }) => api.post('/public/users/login', data),
  z.union([twoFactorAuthResponseSchema, loginSuccessResponseSchema])
)

export default login
