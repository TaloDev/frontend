import { z } from 'zod'
import { organisationSchema } from './organisation'

export enum UserType {
  OWNER,
  ADMIN,
  DEV,
}

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  lastSeenAt: z.string().datetime(),
  emailConfirmed: z.boolean(),
  organisation: organisationSchema,
  type: z.nativeEnum(UserType),
  has2fa: z.boolean(),
  createdAt: z.string().datetime(),
})

export type User = z.infer<typeof userSchema>
