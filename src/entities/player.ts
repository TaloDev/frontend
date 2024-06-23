import { z } from 'zod'
import { propSchema } from './prop'
import { playerGroupSchema } from './playerGroup'
import { gameSchema } from './game'
import { playerAliasSchema, PlayerAlias } from './playerAlias'

export const basePlayerSchema = z.object({
  id: z.string(),
  props: z.array(propSchema),
  devBuild: z.boolean(),
  game: gameSchema,
  createdAt: z.string().datetime(),
  lastSeenAt: z.string().datetime(),
  groups: z.array(playerGroupSchema)
})

export type Player = z.infer<typeof basePlayerSchema> & {
  aliases: PlayerAlias[]
}

export const playerSchema: z.ZodType<Player> = basePlayerSchema.extend({
  aliases: z.lazy(() => playerAliasSchema.array())
})
