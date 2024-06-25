import { z } from 'zod'

const countSchema = z.object({
  count: z.number()
})

export const headlinesSchema = z.object({
  new_players: countSchema,
  returning_players: countSchema,
  events: countSchema,
  unique_event_submitters: countSchema
})

export type Headlines = z.infer<typeof headlinesSchema>
