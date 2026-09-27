import { z } from 'zod'

export const scheduledGameConfigChangeSchema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.string().nullable(),
  applyAt: z.string().datetime(),
  createdAt: z.string().datetime(),
})

export type ScheduledGameConfigChange = z.infer<typeof scheduledGameConfigChangeSchema>
