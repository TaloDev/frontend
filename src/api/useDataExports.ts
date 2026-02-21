import useSWR from 'swr'
import { z } from 'zod'
import { dataExportSchema } from '../entities/dataExport'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

const useDataExports = (activeGame: Game, createdExportId: number | null) => {
  const fetcher = async ([url]: [string]) => {
    const res = await makeValidatedGetRequest(
      url,
      z.object({
        dataExports: z.array(dataExportSchema),
      }),
    )

    return res
  }

  const { data, error } = useSWR([`/games/${activeGame.id}/data-exports`, createdExportId], fetcher)

  return {
    dataExports: data?.dataExports ?? [],
    loading: !data && !error,
    error: error && buildError(error),
  }
}

export default useDataExports
