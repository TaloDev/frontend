import { z } from 'zod'
import { UserType, userSchema } from '../entities/user'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const changeMemberType = makeValidatedRequest(
  (userId: number, type: UserType) => api.patch(`/organisations/members/${userId}`, { type }),
  z.object({
    user: userSchema,
  }),
)
