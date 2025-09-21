import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { ResetMode } from '../constants/resetMode'

export const resetStat = makeValidatedRequest(
  (gameId: number, statId: number, mode: ResetMode) => {
    return api.delete(`/games/${gameId}/game-stats/${statId}/player-stats?mode=${mode}`)
  },
  z.object({
    deletedCount: z.number()
  })
)
