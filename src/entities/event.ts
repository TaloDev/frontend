import { z } from 'zod'
import { propSchema } from './prop'
import { playerAliasSchema } from './playerAlias'

export const eventSchema = z.object({
  id: z.number(),
  name: z.string(),
  props: z.array(propSchema),
  playerAlias: playerAliasSchema,
  gameId: z.number(),
  createdAt: z.string().datetime()
})

export type Event = z.infer<typeof eventSchema>
