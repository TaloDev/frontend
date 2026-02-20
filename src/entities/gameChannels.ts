import { z } from 'zod'
import { playerAliasSchema } from './playerAlias'
import { propSchema } from './prop'

export const gameChannelSchema = z.object({
  id: z.number(),
  name: z.string(),
  owner: z.union([playerAliasSchema, z.null()]),
  totalMessages: z.number(),
  props: z.array(propSchema),
  memberCount: z.number(),
  autoCleanup: z.boolean(),
  private: z.boolean(),
  temporaryMembership: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type GameChannel = z.infer<typeof gameChannelSchema>
