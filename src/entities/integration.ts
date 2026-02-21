import { z } from 'zod'

export enum IntegrationType {
  STEAMWORKS = 'steamworks',
}

export const steamIntegrationConfigSchema = z.object({
  appId: z.number(),
  syncLeaderboards: z.boolean(),
  syncStats: z.boolean(),
})

export type SteamIntegrationConfig = z.infer<typeof steamIntegrationConfigSchema>

// use union when more integrations are added
export const integrationConfigSchema = steamIntegrationConfigSchema

export type IntegrationConfig = z.infer<typeof integrationConfigSchema>

export const integrationSchema = z.object({
  id: z.number(),
  type: z.nativeEnum(IntegrationType),
  config: integrationConfigSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Integration = z.infer<typeof integrationSchema>
