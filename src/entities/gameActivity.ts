import { z } from 'zod'

const extraSchema = z.object({
  display: z.record(z.unknown()).optional()
}).catchall(z.unknown())

export const gameActivitySchema = z.object({
  id: z.number(),
  type: z.string(),
  description: z.string(),
  extra: extraSchema,
  createdAt: z.string().datetime()
})

export type GameActivity = z.infer<typeof gameActivitySchema>
