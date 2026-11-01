import { z } from 'zod'

export const apiKeySchema = z.object({
  id: z.number(),
  keyEnding: z.string().optional(),
  scopes: z.array(z.string()),
  gameId: z.number(),
  createdBy: z.string(),
  createdAt: z.iso.datetime(),
  lastUsedAt: z.iso.datetime().nullish(),
})

export type APIKey = z.infer<typeof apiKeySchema>
