import { z } from 'zod'
import { basePlayerSchema } from './player'

export enum PlayerAliasService {
  STEAM = 'steam',
  EPIC = 'epic',
  USERNAME = 'username',
  EMAIL = 'email',
  CUSTOM = 'custom',
  TALO = 'talo',
}

export const playerAliasSchema = z.object({
  id: z.number(),
  service: z.string(),
  identifier: z.string(),
  player: z.lazy(() => basePlayerSchema),
  lastSeenAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type PlayerAlias = z.infer<typeof playerAliasSchema>
