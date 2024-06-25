import api from './api'
import { z } from 'zod'
import makeValidatedRequest from './makeValidatedRequest'

const deleteStat = makeValidatedRequest(
  (gameId: number, statId: number) => api.delete(`/games/${gameId}/game-stats/${statId}`),
  z.object({}).strict()
)

export default deleteStat
