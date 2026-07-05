import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import useEventBreakdown from '../api/useEventBreakdown'
import { EventsProvider, useEventsContext } from '../components/events/EventsContext'
import EventsDisplay from '../components/events/EventsDisplay'
import EventsFiltersSection from '../components/events/EventsFiltersSection'
import Page from '../components/Page'
import routes from '../constants/routes'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'

export default function EventBreakdown() {
  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame

  const navigate = useNavigate()
  const location = useLocation()

  const eventName = location.state?.eventName

  useEffect(() => {
    if (!eventName) {
      navigate(routes.eventsOverview, { replace: true })
    }
  }, [eventName, navigate])

  if (!eventName) {
    return null
  }

  return (
    <EventsProvider localStorageKey={`eventBreakdown${encodeURIComponent(eventName)}`}>
      <EventBreakdownDisplay activeGame={activeGame} />
    </EventsProvider>
  )
}

function EventBreakdownDisplay({ activeGame }: { activeGame: SelectedActiveGame }) {
  const location = useLocation()

  const { debouncedStartDate, debouncedEndDate } = useEventsContext()
  const { events, eventNames, loading, error } = useEventBreakdown(
    activeGame,
    location.state.eventName,
    debouncedStartDate,
    debouncedEndDate,
  )

  return (
    <Page showBackButton title={`${location.state.eventName} breakdown`} isLoading={loading}>
      <EventsFiltersSection eventNames={eventNames} error={error} entityName='event props' />
      <EventsDisplay
        events={events}
        eventNames={eventNames}
        loading={loading}
        error={error}
        entityName='event props'
      />
    </Page>
  )
}
