import { z } from 'zod'

export const gameStatSchema = z.object({
  id: z.number(),
  internalName: z.string(),
  name: z.string(),
  global: z.boolean(),
  globalValue: z.number(),
  metrics: z
    .object({
      globalCount: z.number(),
      globalValue: z.object({
        minValue: z.number(),
        maxValue: z.number(),
        medianValue: z.number(),
        averageValue: z.number(),
        averageChange: z.number(),
      }),
      playerValue: z.object({
        minValue: z.number(),
        maxValue: z.number(),
        medianValue: z.number(),
        averageValue: z.number(),
      }),
    })
    .optional(),
  defaultValue: z.number(),
  maxChange: z.number().nullable(),
  minValue: z.number().nullable(),
  maxValue: z.number().nullable(),
  minTimeBetweenUpdates: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type GameStat = z.infer<typeof gameStatSchema>
