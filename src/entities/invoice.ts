import { z } from 'zod'

export const invoiceSchema = z.object({
  lines: z.array(
    z.object({
      id: z.string(),
      amount: z.number(),
      description: z.string().nullable(),
      period: z.object({
        start: z.number(),
        end: z.number(),
      }),
    }),
  ),
  total: z.number(),
  collectionDate: z.number(),
  prorationDate: z.number(),
})

export type Invoice = z.infer<typeof invoiceSchema>
