import { z } from 'zod'
import { ResetMode } from '../constants/resetMode'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const resetStat = makeValidatedRequest(
  (gameId: number, statId: number, mode: ResetMode) => {
    return api.delete(`/games/${gameId}/game-stats/${statId}/player-stats?mode=${mode}`)
  },
  z.object({
    deletedCount: z.number(),
  }),
)
