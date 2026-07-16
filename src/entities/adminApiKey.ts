import { z } from 'zod'

export const adminApiKeySchema = z.object({
  id: z.number(),
  scopes: z.array(z.string()),
  gameId: z.number(),
  createdBy: z.string(),
  keyEnding: z.string(),
  createdAt: z.string().datetime(),
  lastUsedAt: z.string().datetime().nullish(),
})

export type AdminApiKey = z.infer<typeof adminApiKeySchema>
