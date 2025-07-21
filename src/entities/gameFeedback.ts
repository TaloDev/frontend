import { z } from 'zod'
import { playerAliasSchema } from './playerAlias'
import { gameFeedbackCategorySchema } from './gameFeedbackCategory'
import { propSchema } from './prop'

export const gameFeedbackSchema = z.object({
  id: z.number(),
  category: gameFeedbackCategorySchema,
  comment: z.string(),
  anonymised: z.boolean(),
  playerAlias: playerAliasSchema.nullable(),
  devBuild: z.boolean(),
  props: z.array(propSchema),
  createdAt: z.string().datetime()
})

export type GameFeedback = z.infer<typeof gameFeedbackSchema>
