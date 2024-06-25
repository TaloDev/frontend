import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const logout = makeValidatedRequest(
  () => api.post('/users/logout'),
  z.object({}).strict()
)

export default logout
