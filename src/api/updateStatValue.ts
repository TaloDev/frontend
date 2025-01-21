import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { playerGameStatSchema } from '../entities/playerGameStat'

const updateStatValue = makeValidatedRequest(
  (gameId: number, statId: number, playerStatId: number, newValue: number) => {
    return api.patch(`/games/${gameId}/game-stats/${statId}/player-stats/${playerStatId}`, { newValue })
  },
  z.object({
    playerStat: playerGameStatSchema
  })
)

export default updateStatValue
