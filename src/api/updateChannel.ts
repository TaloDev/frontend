import { z } from 'zod'
import api from './api'
import { GameChannel, gameChannelSchema } from '../entities/gameChannels'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<GameChannel, 'name' | 'autoCleanup' | 'private'> & { ownerAliasId: number | null }

const updateChannel = makeValidatedRequest(
  (gameId: number, channelId: number, data: Data) => api.put(`/games/${gameId}/game-channels/${channelId}`, data),
  z.object({
    channel: gameChannelSchema
  })
)

export default updateChannel
