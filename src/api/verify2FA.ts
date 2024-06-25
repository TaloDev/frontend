import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { userSchema } from '../entities/user'

const verify2FA = makeValidatedRequest(
  (code: string, userId: number) => api.post('/public/users/2fa', { code, userId }),
  z.object({
    accessToken: z.string(),
    user: userSchema
  })
)

export default verify2FA
