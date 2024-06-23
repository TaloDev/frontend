import { PricingPlanProduct } from '../entities/pricingPlan'

export default function pricingPlanMock(extra: Partial<PricingPlanProduct> = {}): PricingPlanProduct {
  return {
    id: 1,
    actions: [],
    name: 'Team plan',
    prices: [
      { amount: 5999, currency: 'usd', interval: 'year', current: false },
      { amount: 499, currency: 'usd', interval: 'month', current: false }
    ],
    stripeId: 'plan_1',
    hidden: false,
    default: false,
    ...extra
  }
}
