import { z } from 'zod'
import {
  ScheduledGameConfigChange,
  scheduledGameConfigChangeSchema,
} from '../entities/scheduledGameConfigChange'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export type ScheduledGameConfigChangeData = Omit<ScheduledGameConfigChange, 'id' | 'createdAt'>

export const createScheduledGameConfigChanges = makeValidatedRequest(
  (gameId: number, changes: ScheduledGameConfigChangeData[]) =>
    api.post(`/games/${gameId}/game-config/scheduled-changes`, { changes }),
  z.object({
    changes: z.array(scheduledGameConfigChangeSchema),
  }),
)
