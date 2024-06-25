import { z } from 'zod'
import { propSchema } from './prop'

export const gameSchema = z.object({
  id: z.number(),
  name: z.string(),
  props: z.array(propSchema),
  playerCount: z.number().optional(),
  createdAt: z.string().datetime()
})

export type Game = z.infer<typeof gameSchema>
