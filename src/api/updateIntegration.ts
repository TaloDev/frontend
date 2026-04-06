import { z } from 'zod'
import {
  GameCenterIntegrationConfig,
  GooglePlayGamesIntegrationConfig,
  SteamIntegrationConfig,
  integrationSchema,
} from '../entities/integration'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

type IntegrationConfig =
  | SteamIntegrationConfig
  | GooglePlayGamesIntegrationConfig
  | GameCenterIntegrationConfig

const updateIntegration = makeValidatedRequest(
  (gameId: number, integrationId: number, data: { config: Partial<IntegrationConfig> }) =>
    api.patch(`/games/${gameId}/integrations/${integrationId}`, data),
  z.object({
    integration: integrationSchema,
  }),
)

export default updateIntegration
