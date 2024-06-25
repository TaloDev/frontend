import { z } from 'zod'

export enum LeaderboardSortMode {
  DESC = 'desc',
  ASC = 'asc'
}

export const leaderboardSchema = z.object({
  id: z.number(),
  internalName: z.string(),
  name: z.string(),
  sortMode: z.nativeEnum(LeaderboardSortMode),
  unique: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type Leaderboard = z.infer<typeof leaderboardSchema>
