import { z } from 'zod'
import { UserType } from '../entities/user'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'
import { inviteSchema } from '../entities/invite'

const createInvite = makeValidatedRequest(
  (email: string, type: UserType) => api.post('/invites', { email, type }),
  z.object({
    invite: inviteSchema
  })
)

export default createInvite
