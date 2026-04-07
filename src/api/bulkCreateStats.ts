import { z } from 'zod'
import { GameStat, gameStatSchema } from '../entities/gameStat'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type StatData = Pick<
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

const bulkCreateStats = makeValidatedRequest(
  (gameId: number, stats: StatData[]) => api.post(`/games/${gameId}/game-stats/bulk`, { stats }),
  z.object({
    stats: z.array(gameStatSchema),
    errors: z.array(z.array(z.string())),
  }),
)

export default bulkCreateStats
