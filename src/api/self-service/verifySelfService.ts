import { z } from 'zod'
import api from '../api'
import makeValidatedRequest from '../makeValidatedRequest'

export const verifySelfService = makeValidatedRequest(
  (token: string, aliasId: number, code: string) =>
    api.post(`/public/players/${token}/verify`, { aliasId, code }),
  z.object({
    alias: z.object({
      id: z.number(),
      identifier: z.string(),
      player: z.object({
        id: z.string(),
      }),
    }),
    sessionToken: z.string(),
  }),
)
