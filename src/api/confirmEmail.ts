import { z } from 'zod'
import { userSchema } from '../entities/user'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const confirmEmail = makeValidatedRequest(
  (code: string) => api.post('/users/confirm_email', { code }),
  z.object({
    user: userSchema,
  }),
)

export default confirmEmail
