import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { EventFunnelStep, FunnelResultStep } from '../entities/eventFunnel'
import { Game } from '../entities/game'
import buildError from '../utils/buildError'
import { convertDateToUTC } from '../utils/convertDateToUTC'
import { isFunnelStepsValid, prepareFunnelStep } from '../utils/funnel-rules'
import { previewEventFunnel } from './previewEventFunnel'

export function useEventFunnelPreview(
  activeGame: Game,
  steps: EventFunnelStep[],
  maxGap: number,
  startDate: string,
  endDate: string,
) {
  const stepsValid = isFunnelStepsValid(steps)

  const body = {
    steps: steps.map(prepareFunnelStep),
    maxGap,
    startDate: convertDateToUTC(startDate),
    endDate: convertDateToUTC(endDate, true),
  }

  const fetcher = async () => {
    return previewEventFunnel(activeGame.id, body)
  }

  const { data, error, mutate } = useSWR(
    activeGame && stepsValid && startDate && endDate
      ? [`games/${activeGame.id}/event-funnels/preview`, JSON.stringify(body)]
      : null,
    fetcher,
  )

  const [lastValidSteps, setLastValidSteps] = useState<FunnelResultStep[]>([])

  useEffect(() => {
    if (data?.result.steps) {
      setLastValidSteps(data.result.steps)
    }
  }, [data])

  return {
    resultSteps: stepsValid ? (data?.result.steps ?? lastValidSteps) : lastValidSteps,
    loading: stepsValid && !data && !error,
    error: error && buildError(error),
    mutate,
  }
}
