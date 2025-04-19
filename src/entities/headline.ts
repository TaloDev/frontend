import { z } from 'zod'

export const countSchema = z.object({
  count: z.number()
})

export const averageSessionDurationSchema = z.object({
  hours: z.number(),
  minutes: z.number(),
  seconds: z.number()
})

export const headlinesSchema = z.object({
  new_players: countSchema,
  returning_players: countSchema,
  events: countSchema,
  unique_event_submitters: countSchema,
  total_sessions: countSchema,
  average_session_duration: averageSessionDurationSchema
})

export type Headlines = z.infer<typeof headlinesSchema>
