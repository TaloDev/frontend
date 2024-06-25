import { z } from 'zod'
import { basePlayerSchema } from './player'

export enum PlayerAliasService {
  STEAM = 'steam',
  EPIC = 'epic',
  USERNAME = 'username',
  EMAIL = 'email',
  CUSTOM = 'custom'
}

export const playerAliasSchema = z.object({
  id: z.number(),
  service: z.nativeEnum(PlayerAliasService),
  identifier: z.string(),
  player: z.lazy(() => basePlayerSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type PlayerAlias = z.infer<typeof playerAliasSchema>
