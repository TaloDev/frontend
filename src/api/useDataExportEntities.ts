import useSWR from 'swr'
import buildError from '../utils/buildError'
import { Game } from '../entities/game'
import { z } from 'zod'
import { DataExportAvailableEntities } from '../entities/dataExport'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useDataExportEntities(activeGame: Game) {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(url, z.object({
      entities: z.array(z.nativeEnum(DataExportAvailableEntities))
    }))

    return res
  }

  const { data, error } = useSWR(
    [`/games/${activeGame.id}/data-exports/entities`],
    fetcher
  )

  return {
    entities: data?.entities ?? [],
    loading: !data && !error,
    error: error && buildError(error)
  }
}
