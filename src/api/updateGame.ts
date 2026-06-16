import { z } from 'zod'
import { gameSchema } from '../entities/game'
import { Prop } from '../entities/prop'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = {
  name?: string
  props?: Prop[]
  purgeDevPlayers?: boolean
  purgeLivePlayers?: boolean
  purgeDevPlayersRetention?: number
  purgeLivePlayersRetention?: number
  blockAliasIdentifierProfanity?: boolean
  blockPropsProfanity?: boolean
  verifyRequests?: boolean
  displayNamePropKey?: string | null
  website?: string | null
}

const updateGame = makeValidatedRequest(
  (gameId: number, data: Data) => api.patch(`/games/${gameId}`, data),
  z.object({
    game: gameSchema,
  }),
)

export default updateGame
