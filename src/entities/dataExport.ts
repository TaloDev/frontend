import { z } from 'zod'

export enum DataExportStatus {
  REQUESTED,
  QUEUED,
  GENERATED,
  SENT,
}

export enum DataExportAvailableEntities {
  EVENTS = 'events',
  PLAYERS = 'players',
  PLAYER_ALIASES = 'playerAliases',
  LEADERBOARD_ENTRIES = 'leaderboardEntries',
  GAME_STATS = 'gameStats',
  PLAYER_GAME_STATS = 'playerGameStats',
  GAME_ACTIVITIES = 'gameActivities',
  GAME_FEEDBACK = 'gameFeedback',
}

export const dataExportSchema = z.object({
  id: z.number(),
  entities: z.array(z.enum(DataExportAvailableEntities)),
  createdBy: z.string(),
  status: z.enum(DataExportStatus),
  createdAt: z.iso.datetime(),
  failedAt: z.iso.datetime().nullish(),
})

export type DataExport = z.infer<typeof dataExportSchema>
