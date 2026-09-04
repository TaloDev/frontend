import { z } from 'zod'
import { EventFunnelStep, eventFunnelSchema } from '../entities/eventFunnel'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = {
  name?: string
  steps?: EventFunnelStep[]
  maxGap?: number
}

export const updateEventFunnel = makeValidatedRequest(
  (gameId: number, funnelId: number, data: Data) =>
    api.patch(`/games/${gameId}/event-funnels/${funnelId}`, data),
  z.object({
    funnel: eventFunnelSchema,
  }),
)
