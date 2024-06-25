import { z } from 'zod'
import { gameSchema } from './game'
import { pricingPlanSchema } from './pricingPlan'

export const statusSchema = z.enum(['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'paused', 'trialing', 'unpaid'])

export const organisationPricingPlanSchema = z.object({
  pricingPlan: pricingPlanSchema,
  status: statusSchema,
  endDate: z.string().datetime().nullable(),
  canViewBillingPortal: z.boolean()
})

export const organisationSchema = z.object({
  id: z.number(),
  name: z.string(),
  games: z.array(gameSchema),
  pricingPlan: z.object({
    status: statusSchema
  })
})

export type Organisation = z.infer<typeof organisationSchema>
