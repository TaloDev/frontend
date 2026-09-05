import { useAtomValue } from 'jotai'
import { useNavigate } from 'react-router'
import { useSWRConfig } from 'swr'
import { EventFunnelBuilder } from '../components/event-funnels/EventFunnelBuilder'
import { EventsProvider } from '../components/events/EventsContext'
import Page from '../components/Page'
import { SecondaryNav } from '../components/SecondaryNav'
import routes from '../constants/routes'
import { eventsSecondaryNavRoutes } from '../constants/secondaryNavRoutes'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'

const localStorageKey = 'eventFunnelNew'

export default function EventFunnelNew() {
  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()

  const secondaryNav = <SecondaryNav routes={eventsSecondaryNavRoutes} />

  return (
    <EventsProvider localStorageKey={localStorageKey}>
      <Page title='New funnel' showBackButton secondaryNav={secondaryNav}>
        <EventFunnelBuilder
          activeGame={activeGame}
          editingFunnel={null}
          onSaved={async (funnel) => {
            navigate(routes.eventFunnel.replace(':funnelId', String(funnel.id)), {
              replace: true,
              state: { funnel },
            })
            void mutate([`games/${activeGame.id}/event-funnels`])
          }}
        />
      </Page>
    </EventsProvider>
  )
}
