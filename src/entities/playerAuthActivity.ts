import { z } from 'zod'

export const playerAuthActivitySchema = z.object({
  id: z.number(),
  type: z.number(),
  description: z.string(),
  extra: z.record(z.string(), z.unknown()),
  createdAt: z.iso.datetime(),
})

export type PlayerAuthActivity = z.infer<typeof playerAuthActivitySchema>
