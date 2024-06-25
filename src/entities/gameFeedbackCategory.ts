import { z } from 'zod'

export const gameFeedbackCategorySchema = z.object({
  id: z.number(),
  internalName: z.string(),
  name: z.string(),
  description: z.string(),
  anonymised: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type GameFeedbackCategory = z.infer<typeof gameFeedbackCategorySchema>
