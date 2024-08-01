import { z } from 'zod'

export const apiKeySchema = z.object({
  id: z.number(),
  scopes: z.array(z.string()),
  gameId: z.number(),
  createdBy: z.string(),
  createdAt: z.string().datetime(),
  lastUsedAt: z.string().datetime().nullable()
})

export type APIKey = z.infer<typeof apiKeySchema>
