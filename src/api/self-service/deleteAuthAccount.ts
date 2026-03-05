import { z } from 'zod'
import api from '../api'
import makeValidatedRequest from '../makeValidatedRequest'

export const deleteAuthAccount = makeValidatedRequest(
  (gameToken: string, sessionToken: string) =>
    api.delete(`/public/players/${gameToken}`, {
      data: { sessionToken },
    }),
  z.literal(''),
)
