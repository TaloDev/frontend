import { z } from 'zod'
import api from '../api'
import makeValidatedRequest from '../makeValidatedRequest'

const verificationRequiredSchema = z.object({
  aliasId: z.number(),
  verificationRequired: z.literal(true),
})

const sessionSchema = z.object({
  alias: z.object({
    id: z.number(),
    identifier: z.string(),
    player: z.object({
      id: z.string(),
    }),
  }),
  sessionToken: z.string(),
})

export const loginSelfService = makeValidatedRequest(
  (gameToken: string, identifier: string, password: string) =>
    api.post(`/public/players/${gameToken}/login`, { identifier, password }),
  z.union([verificationRequiredSchema, sessionSchema]),
)
