import { z } from 'zod'
import { leaderboardSchema } from '../entities/leaderboard'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const findLeaderboard = makeValidatedRequest(
  (gameId: number, internalName: string) =>
    api.get(`/games/${gameId}/leaderboards?internalName=${internalName}`),
  z.object({
    leaderboards: z.array(leaderboardSchema),
  }),
)

export default findLeaderboard
