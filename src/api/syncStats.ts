import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const syncStats = makeValidatedRequest(
  (gameId: number, integrationId: number) =>
    api.post(`/games/${gameId}/integrations/${integrationId}/sync-stats`),
  z.literal(''),
)

export default syncStats
