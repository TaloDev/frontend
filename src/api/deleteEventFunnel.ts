import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const deleteEventFunnel = makeValidatedRequest(
  (gameId: number, funnelId: number) => api.delete(`/games/${gameId}/event-funnels/${funnelId}`),
  z.literal(''),
)
