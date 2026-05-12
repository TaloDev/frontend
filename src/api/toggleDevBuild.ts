import { z } from 'zod'
import { playerSchema } from '../entities/player'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const toggleDevBuild = makeValidatedRequest(
  (gameId: number, playerId: string, devBuild: boolean) =>
    api.patch(`/games/${gameId}/players/${playerId}/toggle-dev-build`, { devBuild }),
  z.object({
    player: playerSchema,
  }),
)
