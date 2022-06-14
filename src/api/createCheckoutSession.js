import api from './api'

export default (pricingPlanId, pricingInterval) => api.post('/billing/checkout-session', { pricingPlanId, pricingInterval })
