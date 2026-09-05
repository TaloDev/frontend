import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const deleteEventRetention = makeValidatedRequest(
  (gameId: number, eventName: string) =>
    api.delete(`/games/${gameId}/events/retention`, { params: { eventName } }),
  z.literal(''),
)
