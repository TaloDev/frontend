import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { ResetMode } from '../constants/resetMode'

export const resetLeaderboard = makeValidatedRequest(
  (gameId: number, leaderboardId: number, mode: ResetMode) => {
    return api.delete(`/games/${gameId}/leaderboards/${leaderboardId}/entries?mode=${mode}`)
  },
  z.object({
    deletedCount: z.number()
  })
)
