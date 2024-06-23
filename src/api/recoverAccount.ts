import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { userSchema } from '../entities/user'

const recoverAccount = makeValidatedRequest(
  (code: string, userId: number) => api.post('/public/users/2fa/recover', { code, userId }),
  z.object({
    accessToken: z.string(),
    user: userSchema,
    newRecoveryCodes: z.array(z.string()).optional()
  })
)

export default recoverAccount
