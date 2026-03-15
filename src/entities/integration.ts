import { z } from 'zod'

export enum IntegrationType {
  STEAMWORKS = 'steamworks',
  GOOGLE_PLAY_GAMES = 'google-play-games',
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
])

export type Integration = z.infer<typeof integrationSchema>
