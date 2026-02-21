import { z } from 'zod'
import { dataExportSchema } from '../entities/dataExport'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const createDataExport = makeValidatedRequest(
  (gameId: number, entities: string[]) => api.post(`/games/${gameId}/data-exports`, { entities }),
  z.object({
    dataExport: dataExportSchema,
  }),
)

export default createDataExport
