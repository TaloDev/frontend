import { z } from 'zod'
import { inviteSchema } from '../entities/invite'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const getInvite = makeValidatedRequest(
  (token: string) => api.get(`/public/invites/${token}`),
  z.object({
    invite: inviteSchema,
  }),
)

export default getInvite
