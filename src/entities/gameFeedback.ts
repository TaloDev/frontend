import { z } from 'zod'
import { gameFeedbackCategorySchema } from './gameFeedbackCategory'
import { playerAliasSchema } from './playerAlias'
import { propSchema } from './prop'

export const gameFeedbackSchema = z.object({
  id: z.number(),
  category: gameFeedbackCategorySchema,
  comment: z.string(),
  anonymised: z.boolean(),
  playerAlias: playerAliasSchema.nullable(),
  devBuild: z.boolean(),
  props: z.array(propSchema),
  createdAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type GameFeedback = z.infer<typeof gameFeedbackSchema>
