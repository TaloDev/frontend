import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const deleteLeaderboard = makeValidatedRequest(
  (gameId: number, leaderboardId: number) =>
    api.delete(`/games/${gameId}/leaderboards/${leaderboardId}`),
  z.literal(''),
)

export default deleteLeaderboard
