import { z } from 'zod'
import { playerAliasSchema } from './playerAlias'
import { propSchema } from './prop'

export const leaderboardEntrySchema = z.object({
  id: z.number(),
  position: z.number().optional(),
  score: z.number(),
  leaderboardName: z.string(),
  leaderboardInternalName: z.string(),
  playerAlias: playerAliasSchema,
  hidden: z.boolean(),
  props: z.array(propSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable()
})

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>
