import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const requestNewPassword = makeValidatedRequest(
  (email: string) => api.post('/public/users/forgot_password', { email }),
  z.literal(''),
)

export default requestNewPassword
