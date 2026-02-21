import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const deleteGroup = makeValidatedRequest(
  (gameId: number, groupId: string) => api.delete(`/games/${gameId}/player-groups/${groupId}`),
  z.literal(''),
)

export default deleteGroup
