import { z } from 'zod'
import { playerAliasSchema } from './playerAlias'

export const leaderboardEntrySchema = z.object({
  id: z.number(),
  position: z.number().optional(),
  score: z.number(),
  leaderboardName: z.string(),
  leaderboardInternalName: z.string(),
  playerAlias: playerAliasSchema,
  hidden: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>
