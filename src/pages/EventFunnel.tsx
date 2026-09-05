import { useAtomValue } from 'jotai'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useSWRConfig } from 'swr'
import type { EventFunnel } from '../entities/eventFunnel'
import { refreshEventFunnel } from '../api/refreshEventFunnel'
import { useEventFunnel } from '../api/useEventFunnel'
import ErrorMessage from '../components/ErrorMessage'
import { EventFunnelBuilder } from '../components/event-funnels/EventFunnelBuilder'
import { EventsProvider, useEventsContext } from '../components/events/EventsContext'
import Loading from '../components/Loading'
import Page from '../components/Page'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import routes from '../constants/routes'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

export default function EventFunnel() {
  const { funnelId } = useParams()
  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame
  const navigate = useNavigate()

  const parsedFunnelId = Number(funnelId)
  const funnelIdValid = Number.isFinite(parsedFunnelId)

  useEffect(() => {
    if (!funnelIdValid) {
      navigate(routes.eventsFunnels, { replace: true })
    }
  }, [funnelIdValid, navigate])

  if (!funnelIdValid) {
    return null
  }

  return (
    <EventsProvider localStorageKey={`eventFunnel${funnelId}`}>
      <EventFunnelDisplay activeGame={activeGame} funnelId={parsedFunnelId} />
    </EventsProvider>
  )
}

type EventFunnelPageState = { funnel?: EventFunnel } | null

function EventFunnelDisplay({
  activeGame,
  funnelId,
}: {
  activeGame: SelectedActiveGame
  funnelId: number
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useContext(ToastContext)
  const { mutate: mutateCache } = useSWRConfig()

  const initialFunnel = (location.state as EventFunnelPageState)?.funnel

  const { debouncedStartDate, debouncedEndDate } = useEventsContext()

  const { funnel, result, loading, error, mutate } = useEventFunnel({
    activeGame,
    funnelId,
    startDate: debouncedStartDate,
    endDate: debouncedEndDate,
    initialFunnel,
  })

  const [isRefreshing, setRefreshing] = useState(false)

  const refreshData = async () => {
    await mutateCache([`games/${activeGame.id}/event-funnels`])
    await mutate()
  }

  const onDeleted = async () => {
    await mutateCache([`games/${activeGame.id}/event-funnels`])
    await mutate(undefined, { revalidate: false })
    navigate(routes.eventsFunnels, { replace: true })
  }

  useEffect(() => {
    if (error && !funnel && !loading) {
      navigate(routes.eventsFunnels, { replace: true })
    }
  }, [error, funnel, loading, navigate])

  const onRefreshClick = async () => {
    setRefreshing(true)

    try {
      await refreshEventFunnel(activeGame.id, funnelId)
      await mutate()
      toast.trigger('Funnel refreshed', ToastType.SUCCESS)
    } catch (err) {
      toast.trigger(buildError(err).message, ToastType.ERROR)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Page title={funnel?.name ?? 'Event funnel'} showBackButton isLoading={loading}>
      {!funnel && (
        <div className='flex justify-center py-16'>
          <Loading size={32} thickness={180} />
        </div>
      )}

      {funnel && (
        <EventFunnelBuilder
          key={funnel.id}
          activeGame={activeGame}
          editingFunnel={funnel}
          onSaved={refreshData}
          onDeleted={onDeleted}
          previewLastUpdatedAt={result?.lastUpdatedAt}
          previewOnRefresh={onRefreshClick}
          previewRefreshing={isRefreshing}
        />
      )}

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
