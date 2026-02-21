import { z } from 'zod'
import { inviteSchema } from '../entities/invite'
import { UserType } from '../entities/user'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const createInvite = makeValidatedRequest(
  (email: string, type: UserType) => api.post('/invites', { email, type }),
  z.object({
    invite: inviteSchema,
  }),
)

export default createInvite
