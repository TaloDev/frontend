import { z } from 'zod'
import { GameStat, gameStatSchema } from '../entities/gameStat'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<
  GameStat,
  | 'internalName'
  | 'name'
  | 'global'
  | 'defaultValue'
  | 'maxChange'
  | 'minValue'
  | 'maxValue'
  | 'minTimeBetweenUpdates'
>

const createStat = makeValidatedRequest(
  (gameId: number, data: Data) => api.post(`/games/${gameId}/game-stats`, data),
  z.object({
    stat: gameStatSchema,
  }),
)

export default createStat
