import { z } from 'zod'
import { gameSchema } from '../entities/game'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { Prop } from '../entities/prop'

const updateGame = makeValidatedRequest(
  (gameId: number, data: { name?: string, props?: Prop[] }) => api.patch(`/games/${gameId}`, data),
  z.object({
    game: gameSchema
  })
)

export default updateGame
