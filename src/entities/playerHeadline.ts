import { z } from 'zod'

const countSchema = z.object({
  count: z.number()
})

export const playerHeadlinesSchema = z.object({
  total_players: countSchema,
  online_players: countSchema
})

export type PlayerHeadlines = z.infer<typeof playerHeadlinesSchema>
