import { z } from 'zod'
import { playerAliasSchema } from './playerAlias'

export const channelStoragePropSchema = z.object({
  key: z.string(),
  value: z.string().nullable(),
  createdBy: playerAliasSchema,
  lastUpdatedBy: playerAliasSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ChannelStorageProp = z.infer<typeof channelStoragePropSchema>
