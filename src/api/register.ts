import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { userSchema } from '../entities/user'

export type Data = {
  email: string
  password: string
  organisationName?: string
  username: string
  inviteToken?: string
}

const register = makeValidatedRequest(
  (data: Data) => api.post('/public/users/register', data),
  z.object({
    accessToken: z.string(),
    user: userSchema
  })
)

export default register
