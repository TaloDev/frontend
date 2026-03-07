import { z } from 'zod'
import api from '../api'
import makeValidatedRequest from '../makeValidatedRequest'

export const verifySelfService = makeValidatedRequest(
  (gameToken: string, aliasId: number, code: string) =>
    api.post(`/public/players/${gameToken}/verify`, { aliasId, code }),
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
