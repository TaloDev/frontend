import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { userSchema } from '../entities/user'

const createDemo = makeValidatedRequest(
  () => api.post('/public/demo'),
  z.object({
    accessToken: z.string(),
    user: userSchema
  })
)

export default createDemo
