import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const deleteStat = makeValidatedRequest(
  (gameId: number, statId: number) => api.delete(`/games/${gameId}/game-stats/${statId}`),
  z.literal(''),
)

export default deleteStat
