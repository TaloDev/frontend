import { z } from 'zod'
import { gameSchema } from '../entities/game'
import { Prop } from '../entities/prop'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const updateGameConfig = makeValidatedRequest(
  (gameId: number, props: Prop[]) => api.patch(`/games/${gameId}/game-config`, { props }),
  z.object({
    game: gameSchema,
  }),
)
