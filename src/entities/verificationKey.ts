import { z } from 'zod'

export const verificationKeySchema = z.object({
  id: z.number(),
  version: z.string(),
  value: z.string(),
  createdAt: z.string(),
})

export type VerificationKey = z.infer<typeof verificationKeySchema>
