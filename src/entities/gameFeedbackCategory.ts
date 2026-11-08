import { z } from 'zod'

export const gameFeedbackCategorySchema = z.object({
  id: z.number(),
  internalName: z.string(),
  name: z.string(),
  description: z.string(),
  anonymised: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type GameFeedbackCategory = z.infer<typeof gameFeedbackCategorySchema>
