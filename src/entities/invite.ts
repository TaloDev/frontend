import { z } from 'zod'
import { organisationSchema } from './organisation'
import { UserType } from './user'

export const inviteSchema = z.object({
  id: z.number(),
  email: z.email(),
  organisation: organisationSchema,
  type: z.enum(UserType),
  invitedBy: z.string(),
  createdAt: z.iso.datetime(),
})

export type Invite = z.infer<typeof inviteSchema>
