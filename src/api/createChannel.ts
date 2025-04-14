import { z } from 'zod'
import { GameChannel, gameChannelSchema } from '../entities/gameChannels'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type Data = Pick<GameChannel, 'name' | 'autoCleanup' | 'private'> & { ownerAliasId: number | null }

const createChannel = makeValidatedRequest(
  (gameId: number, data: Data) => api.post(`/games/${gameId}/game-channels`, data),
  z.object({
    channel: gameChannelSchema
  })
)

export default createChannel
