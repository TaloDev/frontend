import { IconPlus } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useAtomValue } from 'jotai'
import { useNavigate } from 'react-router'
import { useEventFunnels } from '../api/useEventFunnels'
import Button from '../components/Button'
import { NoEventFunnels } from '../components/empty-states/NoEventFunnels'
import ErrorMessage from '../components/ErrorMessage'
import { EventsProvider } from '../components/events/EventsContext'
import Page from '../components/Page'
import { SecondaryNav } from '../components/SecondaryNav'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import routes from '../constants/routes'
import { eventsSecondaryNavRoutes } from '../constants/secondaryNavRoutes'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'

const localStorageKey = 'eventFunnels'

export default function EventFunnels() {
  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame

  return (
    <EventsProvider localStorageKey={localStorageKey}>
      <EventFunnelsDisplay activeGame={activeGame} />
    </EventsProvider>
  )
}

function EventFunnelsDisplay({ activeGame }: { activeGame: SelectedActiveGame }) {
  const navigate = useNavigate()

  const { funnels, loading, error } = useEventFunnels(activeGame)

  const secondaryNav = <SecondaryNav routes={eventsSecondaryNavRoutes} />

  return (
    <Page
      title='Event funnels'
      isLoading={loading}
      secondaryNav={secondaryNav}
      extraTitleComponent={
        <div className='mt-1 ml-4 rounded-full bg-indigo-600 p-1'>
          <Button
            variant='icon'
            onClick={() => navigate(routes.eventsFunnelNew)}
            icon={<IconPlus />}
            extra={{ 'aria-label': 'Create funnel' }}
          />
        </div>
      }
    >
      {funnels.length === 0 && !loading && <NoEventFunnels />}

      {error && <ErrorMessage error={error} />}

      {funnels.length > 0 && (
        <>
          <Table columns={['Name', 'Steps', 'Max gap', 'Last updated', '']}>
            <TableBody iterator={funnels}>
              {(funnel) => (
                <>
                  <TableCell className='max-w-[320px] min-w-[320px] lg:min-w-0'>
                    {funnel.name}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap items-center gap-1'>
                      {funnel.steps.map((step, idx) => (
                        <div key={step.name} className='flex items-center gap-1'>
                          <span className='rounded bg-gray-900 p-2 font-mono text-xs'>
                            {step.name}
                          </span>
                          {idx < funnel.steps.length - 1 && <span>→</span>}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className='font-mono'>{funnel.maxGap}s</TableCell>
                  <DateCell>{format(new Date(funnel.updatedAt), 'dd MMM yyyy')}</DateCell>
                  <TableCell className='w-40'>
                    <Button
                      variant='grey'
                      onClick={() =>
                        navigate(`${routes.eventsFunnels}/${funnel.id}`, { state: { funnel } })
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </>
              )}
            </TableBody>
          </Table>
        </>
      )}
    </Page>
  )
}
