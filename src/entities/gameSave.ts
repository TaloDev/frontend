import { z } from 'zod'

export const gameSaveSchema = z.object({
  id: z.number(),
  name: z.string(),
  content: z.record(z.string(), z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type GameSave = z.infer<typeof gameSaveSchema>
