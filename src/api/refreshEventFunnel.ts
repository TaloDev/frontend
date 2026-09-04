import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const refreshEventFunnel = makeValidatedRequest(
  (gameId: number, funnelId: number) =>
    api.delete(`/games/${gameId}/event-funnels/${funnelId}/refresh`),
  z.literal(''),
)
