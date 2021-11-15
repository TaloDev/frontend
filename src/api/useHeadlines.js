import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'

const useHeadlines = (activeGame, startDate, endDate) => {
  const fetcher = async (url) => {
    const qs = stringify({
      gameId: activeGame.id,
      startDate,
      endDate
    })

    const headlines = ['new_players', 'returning_players', 'events', 'unique_event_submitters']
    const res = await Promise.all(headlines.map((headline) => api.get(`${url}/${headline}?${qs}`)))

    return headlines.reduce((acc, curr, idx) => ({
      ...acc,
      [curr]: res[idx].data
    }), {})
  }

  const { data, error } = useSWR(
    activeGame && startDate && endDate ? ['/headlines', activeGame, startDate, endDate] : null,
    fetcher
  )

  return {
    headlines: data ?? {},
    loading: !data && !error,
    error: error && buildError(error)
  }
}

export default useHeadlines
