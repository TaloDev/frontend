import { z } from 'zod'

export const pricingPlanSchema = z.object({
  id: z.number(),
  stripeId: z.string(),
  hidden: z.boolean(),
  default: z.boolean(),
  playerLimit: z.number()
})

export const pricingPlanUsageSchema = z.object({
  limit: z.number(),
  used: z.number()
})

export type PricingPlanUsage = z.infer<typeof pricingPlanUsageSchema>

const pricingPlanProductPriceSchema = z.object({
  currency: z.string(),
  amount: z.number(),
  interval: z.enum(['day', 'week', 'month', 'year']),
  current: z.boolean()
})

export type PricingPlanProductPrice = z.infer<typeof pricingPlanProductPriceSchema>

export const pricingPlanProductSchema = pricingPlanSchema.merge(
  z.object({
    name: z.string(),
    prices: z.array(
      z.object({
        currency: z.string(),
        amount: z.number(),
        interval: z.enum(['day', 'week', 'month', 'year']),
        current: z.boolean()
      })
    )
  })
)

export type PricingPlanProduct = z.infer<typeof pricingPlanProductSchema>
