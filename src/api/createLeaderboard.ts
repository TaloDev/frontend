import { z } from 'zod'
import { Leaderboard, leaderboardSchema } from '../entities/leaderboard'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<
  Leaderboard,
  'internalName' | 'name' | 'sortMode' | 'unique' | 'uniqueByProps' | 'refreshInterval'
>

const createLeaderboard = makeValidatedRequest(
  (gameId: number, data: Data) => api.post(`/games/${gameId}/leaderboards`, data),
  z.object({
    leaderboard: leaderboardSchema,
  }),
)

export default createLeaderboard
