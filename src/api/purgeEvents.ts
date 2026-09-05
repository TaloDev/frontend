import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const purgeEvents = makeValidatedRequest(
  (gameId: number, eventName: string) =>
    api.delete(`/games/${gameId}/events/purge`, { params: { eventName } }),
  z.object({
    purged: z.number(),
  }),
)
