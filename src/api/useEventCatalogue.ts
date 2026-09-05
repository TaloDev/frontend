import useSWR from 'swr'
import { eventCatalogueSchema } from '../entities/eventCatalogue'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useEventCatalogue(activeGame: Game, page: number) {
  const fetcher = async ([url, page]: [string, number]) => {
    return makeValidatedGetRequest(`${url}?page=${page}`, eventCatalogueSchema)
  }

  const { data, error, mutate } = useSWR([`games/${activeGame.id}/events/catalogue`, page], fetcher)

  return {
    events: data?.events ?? [],
    count: data?.count,
    itemsPerPage: data?.itemsPerPage,
    loading: !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
