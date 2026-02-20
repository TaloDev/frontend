import { z } from 'zod'

export const propSchema = z.object({
  key: z.string(),
  value: z.string().nullable(),
})

export type Prop = z.infer<typeof propSchema>
