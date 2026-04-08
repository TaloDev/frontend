import { z } from 'zod'

export enum IntegrationType {
  STEAMWORKS = 'steamworks',
  GOOGLE_PLAY_GAMES = 'google-play-games',
  GAME_CENTER = 'game-center',
}

export const steamIntegrationConfigSchema = z.object({
  appId: z.number(),
  syncLeaderboards: z.boolean(),
  syncStats: z.boolean(),
})

export type SteamIntegrationConfig = z.infer<typeof steamIntegrationConfigSchema>

export const googlePlayGamesIntegrationConfigSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
})

export type GooglePlayGamesIntegrationConfig = z.infer<
  typeof googlePlayGamesIntegrationConfigSchema
>

export const gameCenterIntegrationConfigSchema = z.object({
  bundleId: z.string(),
})

export type GameCenterIntegrationConfig = z.infer<typeof gameCenterIntegrationConfigSchema>

const baseIntegrationSchema = z.object({
  id: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const integrationSchema = z.discriminatedUnion('type', [
  baseIntegrationSchema.extend({
    type: z.literal(IntegrationType.STEAMWORKS),
    config: steamIntegrationConfigSchema,
  }),
  baseIntegrationSchema.extend({
    type: z.literal(IntegrationType.GOOGLE_PLAY_GAMES),
    config: googlePlayGamesIntegrationConfigSchema,
  }),
  baseIntegrationSchema.extend({
    type: z.literal(IntegrationType.GAME_CENTER),
    config: gameCenterIntegrationConfigSchema,
  }),
])

export type Integration = z.infer<typeof integrationSchema>
