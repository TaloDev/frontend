import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const changePassword = makeValidatedRequest(
  (currentPassword: string, newPassword: string) =>
    api.post('/users/change_password', { currentPassword, newPassword }),
  z.object({
    accessToken: z.string(),
  }),
)

export default changePassword
