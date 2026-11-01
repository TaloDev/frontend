import { z } from 'zod'
import { organisationSchema } from './organisation'

export enum UserType {
  OWNER,
  ADMIN,
  DEV,
}

export const userSchema = z.object({
  id: z.number(),
  email: z.email(),
  username: z.string(),
  lastSeenAt: z.iso.datetime(),
  emailConfirmed: z.boolean(),
  organisation: organisationSchema,
  type: z.enum(UserType),
  has2fa: z.boolean(),
  createdAt: z.iso.datetime(),
})

export type User = z.infer<typeof userSchema>
