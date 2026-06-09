import { z } from 'zod'
import { verificationKeySchema } from '../entities/verificationKey'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

export const createVerificationKey = makeValidatedRequest(
  (gameId: number, version: string, value: string) =>
    api.post(`/games/${gameId}/verification-keys`, { version, value }),
  z.object({ verificationKey: verificationKeySchema }),
)
