import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const createPortalSession = makeValidatedRequest(
  () => api.post('/billing/portal-session'),
  z.object({
    redirect: z.url(),
  }),
)

export default createPortalSession
