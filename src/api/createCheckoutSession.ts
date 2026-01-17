import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { invoiceSchema } from '../entities/invoice'

const createCheckoutSession = makeValidatedRequest(
  (pricingPlanId: number, pricingInterval: string) => api.post('/billing/checkout-session', { pricingPlanId, pricingInterval }),
  z.object({
    redirect: z.string().url().optional(),
    invoice: invoiceSchema.optional()
  })
)

export default createCheckoutSession
