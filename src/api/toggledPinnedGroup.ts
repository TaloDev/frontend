import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const togglePinnedGroup = makeValidatedRequest(
  (gameId: number, groupId: string, pinned: boolean) => api.put(`/games/${gameId}/player-groups/${groupId}/toggle-pinned`, { pinned }),
  z.literal('')
)

export default togglePinnedGroup
