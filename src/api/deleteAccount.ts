import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const deleteAccount = makeValidatedRequest(
  (password: string) => api.post('/users/delete', { password }),
  z.literal(''),
)
