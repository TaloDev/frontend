import { z } from 'zod'
import { Leaderboard, leaderboardSchema } from '../entities/leaderboard'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<
  Leaderboard,
  'internalName' | 'name' | 'sortMode' | 'unique' | 'uniqueByProps' | 'refreshInterval'
>

const updateLeaderboard = makeValidatedRequest(
  (gameId: number, leaderboardId: number, data: Data) =>
    api.put(`/games/${gameId}/leaderboards/${leaderboardId}`, data),
  z.object({
    leaderboard: leaderboardSchema,
  }),
)

export default updateLeaderboard
