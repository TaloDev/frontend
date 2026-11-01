import { z } from 'zod'

export enum LeaderboardSortMode {
  DESC = 'desc',
  ASC = 'asc',
}

export enum LeaderboardRefreshInterval {
  NEVER = 'never',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export const leaderboardSchema = z.object({
  id: z.number(),
  internalName: z.string(),
  name: z.string(),
  sortMode: z.enum(LeaderboardSortMode),
  unique: z.boolean(),
  uniqueByProps: z.boolean(),
  refreshInterval: z.enum(LeaderboardRefreshInterval),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type Leaderboard = z.infer<typeof leaderboardSchema>
