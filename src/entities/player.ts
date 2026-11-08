import { z } from 'zod'
import { playerAliasSchema, PlayerAlias } from './playerAlias'
import { playerPresenceSchema } from './playerPresence'
import { propSchema } from './prop'

export const basePlayerSchema = z.object({
  id: z.uuid(),
  props: z.array(propSchema),
  devBuild: z.boolean(),
  createdAt: z.iso.datetime(),
  lastSeenAt: z.iso.datetime(),
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
