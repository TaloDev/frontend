import api from './api'

const confirmPlan = (prorationDate: number, pricingPlanId: number, pricingInterval: string) =>
  api.post('/billing/confirm-plan', { prorationDate, pricingPlanId, pricingInterval })

export default confirmPlan
