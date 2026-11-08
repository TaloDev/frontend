import { z } from 'zod'

export const adminApiKeySchema = z.object({
  id: z.number(),
  name: z.string(),
  scopes: z.array(z.string()),
  gameId: z.number(),
  createdBy: z.string(),
  keyEnding: z.string(),
  createdAt: z.iso.datetime(),
  lastUsedAt: z.iso.datetime().nullish(),
})

export type AdminApiKey = z.infer<typeof adminApiKeySchema>
