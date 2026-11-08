import { z } from 'zod'

export const scheduledGameConfigChangeSchema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.string().nullable(),
  applyAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
})

export type ScheduledGameConfigChange = z.infer<typeof scheduledGameConfigChangeSchema>
