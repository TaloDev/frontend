import { z } from 'zod'
import api from './api'
import { Leaderboard, leaderboardSchema } from '../entities/leaderboard'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<Leaderboard, 'internalName' | 'name' | 'sortMode' | 'unique'>

const updateLeaderboard = makeValidatedRequest(
  (gameId: number, leaderboardId: number, data: Data) => api.put(`/games/${gameId}/leaderboards/${leaderboardId}`, data),
  z.object({
    leaderboard: leaderboardSchema
  })
)

export default updateLeaderboard
