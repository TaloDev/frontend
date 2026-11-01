import { z } from 'zod'

export const gameActivitySchema = z.object({
  id: z.number(),
  type: z.number(),
  description: z.string(),
  extra: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.iso.datetime(),
})

export type GameActivity = z.infer<typeof gameActivitySchema>
