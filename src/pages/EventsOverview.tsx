import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import Page from '../components/Page'
import EventsDisplay from '../components/events/EventsDisplay'
import EventsFiltersSection from '../components/events/EventsFiltersSection'
import { EventsProvider, useEventsContext } from '../components/events/EventsContext'
import useEvents from '../api/useEvents'

const localStorageKey = 'eventsOverview'

export default function EventsOverview() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  return (
    <EventsProvider localStorageKey={localStorageKey}>
      <EventsOverviewDisplay activeGame={activeGame} />
    </EventsProvider>
  )
}

function EventsOverviewDisplay({ activeGame }: { activeGame: SelectedActiveGame }) {
  const { debouncedStartDate, debouncedEndDate } = useEventsContext()
  const { events, eventNames, loading, error } = useEvents(activeGame, debouncedStartDate, debouncedEndDate)

  return (
    <Page title='Events overview' isLoading={loading}>
      <EventsFiltersSection eventNames={eventNames} error={error} />
      <EventsDisplay
        showBreakdown
        events={events}
        eventNames={eventNames}
        loading={loading}
        error={error}
      />
    </Page>
  )
}
