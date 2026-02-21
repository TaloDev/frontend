import { z } from 'zod'
import { playerSchema } from '../entities/player'
import { Prop } from '../entities/prop'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const updatePlayer = makeValidatedRequest(
  (gameId: number, playerId: string, data: { props: Prop[] }) =>
    api.patch(`/games/${gameId}/players/${playerId}`, data),
  z.object({
    player: playerSchema,
  }),
)

export default updatePlayer
