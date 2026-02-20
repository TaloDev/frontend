import { z } from 'zod'
import { userSchema } from '../entities/user'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const createDemo = makeValidatedRequest(
  () => api.post('/public/demo'),
  z.object({
    accessToken: z.string(),
    user: userSchema,
  }),
)

export default createDemo
