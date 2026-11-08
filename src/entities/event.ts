import { z } from 'zod'
import { playerAliasSchema } from './playerAlias'
import { propSchema } from './prop'

export const eventSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  props: z.array(propSchema),
  playerAlias: playerAliasSchema,
  gameId: z.number(),
  createdAt: z.iso.datetime(),
})

export type Event = z.infer<typeof eventSchema>
