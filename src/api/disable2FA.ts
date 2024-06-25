import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { userSchema } from '../entities/user'

const disable2FA = makeValidatedRequest(
  (password) => api.post('/users/2fa/disable', { password }),
  z.object({
    user: userSchema
  })
)

export default disable2FA
