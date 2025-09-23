import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const deletePlayer = makeValidatedRequest(
  (gameId: number, playerId: string) => api.delete(`/games/${gameId}/players/${playerId}`),
  z.literal('')
)

export default deletePlayer
