import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const createRecoveryCodes = makeValidatedRequest(
  (password: string) => api.post('/users/2fa/recovery_codes/create', { password }),
  z.object({
    recoveryCodes: z.array(z.string()),
  }),
)

export default createRecoveryCodes
