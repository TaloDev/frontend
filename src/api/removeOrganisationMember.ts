import { z } from 'zod'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const removeOrganisationMember = makeValidatedRequest(
  (userId: number) => api.delete(`/organisations/members/${userId}`),
  z.literal(''),
)
