import { z } from 'zod'
import api from '../api'
import makeValidatedRequest from '../makeValidatedRequest'

export const deleteAuthAccount = makeValidatedRequest(
  (token: string, sessionToken: string) =>
    api.delete(`/public/players/${token}`, {
      data: { sessionToken },
    }),
  z.literal(''),
)
