import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const deleteChannel = makeValidatedRequest(
  (gameId: number, channelId: number) => api.delete(`/games/${gameId}/game-channels/${channelId}`),
  z.literal(''),
)

export default deleteChannel
