import { z } from 'zod'
import { PlayerGroup, playerGroupSchema } from '../entities/playerGroup'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<PlayerGroup, 'name' | 'description' | 'rules' | 'ruleMode' | 'membersVisible'>

const updateGroup = makeValidatedRequest(
  (gameId: number, groupId: string, data: Data) =>
    api.put(`/games/${gameId}/player-groups/${groupId}`, data),
  z.object({
    group: playerGroupSchema,
  }),
)

export default updateGroup
