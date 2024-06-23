import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { playerSchema } from '../entities/player'

const findPlayer = makeValidatedRequest(
  (gameId: number, playerId: string) => api.get(`/games/${gameId}/players?search=${playerId}`),
  z.object({
    players: z.array(playerSchema)
  })
)

export default findPlayer
