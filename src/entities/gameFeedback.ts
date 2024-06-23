import { z } from 'zod'
import { playerAliasSchema } from './playerAlias'
import { gameFeedbackCategorySchema } from './gameFeedbackCategory'

export const gameFeedbackSchema = z.object({
  id: z.number(),
  category: gameFeedbackCategorySchema,
  comment: z.string(),
  anonymised: z.boolean(),
  playerAlias: z.union([playerAliasSchema, z.null()]),
  createdAt: z.string().datetime()
})

export type GameFeedback = z.infer<typeof gameFeedbackSchema>
