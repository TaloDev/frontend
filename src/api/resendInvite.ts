import { z } from 'zod'
import { inviteSchema } from '../entities/invite'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const resendInvite = makeValidatedRequest(
  (id: number) => api.post(`/invites/${id}/resend`),
  z.object({
    invite: inviteSchema,
  }),
)

export default resendInvite
