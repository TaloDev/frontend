import { z } from 'zod'
import { gameSchema } from '../entities/game'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const reorderGames = makeValidatedRequest(
  (gameIds: number[]) => api.put('/organisations/games/order', { gameIds }),
  z.object({
    games: z.array(gameSchema),
  }),
)

export default reorderGames
