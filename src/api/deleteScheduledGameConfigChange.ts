import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const deleteScheduledGameConfigChange = makeValidatedRequest(
  (gameId: number, changeId: number) =>
    api.delete(`/games/${gameId}/game-config/scheduled-changes/${changeId}`),
  z.literal(''),
)
