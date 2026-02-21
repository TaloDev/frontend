import { z } from 'zod'
import { ResetMode } from '../constants/resetMode'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const resetLeaderboard = makeValidatedRequest(
  (gameId: number, leaderboardId: number, mode: ResetMode) => {
    return api.delete(`/games/${gameId}/leaderboards/${leaderboardId}/entries?mode=${mode}`)
  },
  z.object({
    deletedCount: z.number(),
  }),
)
