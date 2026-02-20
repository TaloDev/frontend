import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const viewRecoveryCodes = makeValidatedRequest(
  (password: string) => api.post('/users/2fa/recovery_codes/view', { password }),
  z.object({
    recoveryCodes: z.array(z.string()),
  }),
)

export default viewRecoveryCodes
