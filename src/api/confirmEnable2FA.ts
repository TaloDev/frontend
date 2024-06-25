import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { userSchema } from '../entities/user'

const confirmEnable2FA = makeValidatedRequest(
  (code: string) => api.post('/users/2fa/enable', { code }),
  z.object({
    user: userSchema,
    recoveryCodes: z.array(z.string())
  })
)

export default confirmEnable2FA

