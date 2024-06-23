import { z } from 'zod'
import { playerSchema } from '../entities/player'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { Prop } from '../entities/prop'

const updatePlayer = makeValidatedRequest(
  (gameId: number, playerId: string, data: { props: Prop[] }) => api.patch(`/games/${gameId}/players/${playerId}`, data),
  z.object({
    player: playerSchema
  })
)

export default updatePlayer
