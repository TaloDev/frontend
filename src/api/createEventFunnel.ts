import { z } from 'zod'
import { EventFunnelStep, eventFunnelSchema } from '../entities/eventFunnel'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = {
  name: string
  steps: EventFunnelStep[]
  maxGap: number
}

export const createEventFunnel = makeValidatedRequest(
  (gameId: number, data: Data) => api.post(`/games/${gameId}/event-funnels`, data),
  z.object({
    funnel: eventFunnelSchema,
  }),
)
