import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { userSchema } from '../entities/user'

const confirmEmail = makeValidatedRequest(
  (code: string) => api.post('/users/confirm_email', { code }),
  z.object({
    user: userSchema
  })
)

export default confirmEmail
