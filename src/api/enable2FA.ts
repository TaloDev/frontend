import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const enable2FA = makeValidatedRequest(
  () => api.get('/users/2fa/enable'),
  z.object({
    qr: z.string(),
  }),
)

export default enable2FA
