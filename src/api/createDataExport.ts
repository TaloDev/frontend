import { z } from 'zod'
import { dataExportSchema } from '../entities/dataExport'
import api from './api'
import makeValidatedRequest from './makeValidatedRequest'

const createDataExport = makeValidatedRequest(
  (gameId, entities) => api.post(`/games/${gameId}/data-exports`, { entities }),
  z.object({
    dataExport: dataExportSchema
  })
)

export default createDataExport
