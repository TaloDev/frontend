import { z } from 'zod'

export const gameSaveSchema = z.object({
  id: z.number(),
  name: z.string(),
  content: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type GameSave = z.infer<typeof gameSaveSchema>
