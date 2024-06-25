import { z } from 'zod'

export const gameStatSchema = z.object({
  id: z.number(),
  internalName: z.string(),
  name: z.string(),
  global: z.boolean(),
  globalValue: z.number(),
  defaultValue: z.number(),
  maxChange: z.number().nullable(),
  minValue: z.number().nullable(),
  maxValue: z.number().nullable(),
  minTimeBetweenUpdates: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type GameStat = z.infer<typeof gameStatSchema>
