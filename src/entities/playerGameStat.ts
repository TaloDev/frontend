import { z } from 'zod'
import { gameStatSchema } from './gameStat'

export const playerGameStatSchema = z.object({
  id: z.number(),
  stat: gameStatSchema,
  value: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type PlayerGameStat = z.infer<typeof playerGameStatSchema>
