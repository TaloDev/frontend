import { z } from 'zod'
import { PlayerGroup, playerGroupSchema } from '../entities/playerGroup'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<PlayerGroup, 'name' | 'description' | 'rules' | 'ruleMode'>

const createGroup = makeValidatedRequest(
  (gameId: number, data: Data) => api.post(`/games/${gameId}/player-groups`, data),
  z.object({
    group: playerGroupSchema
  })
)

export default createGroup
