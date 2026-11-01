import { z } from 'zod'

export const playerPresenceSchema = z.object({
  online: z.boolean(),
  customStatus: z.string(),
  updatedAt: z.iso.datetime(),
})

export type PlayerPresence = z.infer<typeof playerPresenceSchema>
