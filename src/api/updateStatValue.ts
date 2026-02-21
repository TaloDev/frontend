import { z } from 'zod'
import { playerGameStatSchema } from '../entities/playerGameStat'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const updateStatValue = makeValidatedRequest(
  (gameId: number, statId: number, playerStatId: number, newValue: number) => {
    return api.patch(`/games/${gameId}/game-stats/${statId}/player-stats/${playerStatId}`, {
      newValue,
    })
  },
  z.object({
    playerStat: playerGameStatSchema,
  }),
)

export default updateStatValue
