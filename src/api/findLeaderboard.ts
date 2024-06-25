import { z } from 'zod'
import { leaderboardSchema } from '../entities/leaderboard'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const findLeaderboard = makeValidatedRequest(
  (gameId: number, internalName: string) => api.get(`/games/${gameId}/leaderboards/search?internalName=${internalName}`),
  z.object({
    leaderboard: leaderboardSchema
  })
)

export default findLeaderboard
