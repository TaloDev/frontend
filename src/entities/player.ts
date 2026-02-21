import { z } from 'zod'
import { playerAliasSchema, PlayerAlias } from './playerAlias'
import { playerPresenceSchema } from './playerPresence'
import { propSchema } from './prop'

export const basePlayerSchema = z.object({
  id: z.string().uuid(),
  props: z.array(propSchema),
  devBuild: z.boolean(),
  createdAt: z.string().datetime(),
  lastSeenAt: z.string().datetime(),
  groups: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  presence: playerPresenceSchema.nullable(),
})

export type Player = z.infer<typeof basePlayerSchema> & {
  aliases: PlayerAlias[]
}

export const playerSchema: z.ZodType<Player> = basePlayerSchema.extend({
  aliases: z.lazy(() => playerAliasSchema.array()),
})
