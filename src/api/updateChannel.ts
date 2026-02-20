import { z } from 'zod'
import { GameChannel, gameChannelSchema } from '../entities/gameChannels'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<GameChannel, 'name' | 'autoCleanup' | 'private' | 'temporaryMembership'> & {
  ownerAliasId: number | null
}

const updateChannel = makeValidatedRequest(
  (gameId: number, channelId: number, data: Data) =>
    api.put(`/games/${gameId}/game-channels/${channelId}`, data),
  z.object({
    channel: gameChannelSchema,
  }),
)

export default updateChannel
