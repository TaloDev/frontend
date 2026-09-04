import { z } from 'zod'
import { EventFunnelStep, funnelResultStepSchema } from '../entities/eventFunnel'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = {
  steps: EventFunnelStep[]
  maxGap: number
  startDate: string
  endDate: string
}

export const previewEventFunnel = makeValidatedRequest(
  (gameId: number, data: Data) => api.post(`/games/${gameId}/event-funnels/preview`, data),
  z.object({
    result: z.object({
      steps: z.array(funnelResultStepSchema),
      lastUpdatedAt: z.number(),
    }),
  }),
)
