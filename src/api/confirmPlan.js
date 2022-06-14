import api from './api'

export default (prorationDate, pricingPlanId, pricingInterval) => api.post('/billing/confirm-plan', { prorationDate, pricingPlanId, pricingInterval })
