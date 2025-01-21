import { z } from 'zod'
import { leaderboardEntrySchema } from '../entities/leaderboardEntry'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const updateLeaderboardEntry = makeValidatedRequest(
  (gameId: number, leaderboardId: number, entryId: number, data: { hidden?: boolean, newScore?: number }) =>
    api.patch(`/games/${gameId}/leaderboards/${leaderboardId}/entries/${entryId}`, data),
  z.object({
    entry: leaderboardEntrySchema
  })
)

export default updateLeaderboardEntry
