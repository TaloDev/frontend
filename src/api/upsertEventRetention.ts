import { z } from 'zod'
import { eventRetentionSchema } from '../entities/eventCatalogue'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const upsertEventRetention = makeValidatedRequest(
  (gameId: number, eventName: string, retentionDays: number) =>
    api.put(`/games/${gameId}/events/retention`, { eventName, retentionDays }),
  z.object({
    retention: eventRetentionSchema,
  }),
)
