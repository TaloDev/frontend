import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const syncLeaderboards = makeValidatedRequest(
  (gameId: number, integrationId: number) => api.post(`/games/${gameId}/integrations/${integrationId}/sync-leaderboards`),
  z.literal('')
)

export default syncLeaderboards
