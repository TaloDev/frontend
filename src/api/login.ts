import { z } from 'zod'
import { userSchema } from '../entities/user'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const twoFactorAuthResponseSchema = z.object({
  twoFactorAuthRequired: z.literal(true),
  userId: z.number(),
})

const loginSuccessResponseSchema = z.object({
  accessToken: z.string(),
  user: userSchema,
})

const login = makeValidatedRequest(
  (data: { email: string; password: string }) => api.post('/public/users/login', data),
  z.union([twoFactorAuthResponseSchema, loginSuccessResponseSchema]),
)

export default login
