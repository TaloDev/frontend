import { z } from 'zod'
import { gameSchema } from '../entities/game'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const createGame = makeValidatedRequest(
  (name: string) => api.post('/games', { name }),
  z.object({
    game: gameSchema
  })
)

export default createGame
