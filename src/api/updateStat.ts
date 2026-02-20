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

const updateStat = makeValidatedRequest(
  (gameId: number, statId: number, data: Data) =>
    api.put(`/games/${gameId}/game-stats/${statId}`, data),
  z.object({
    stat: gameStatSchema,
  }),
)

export default updateStat
