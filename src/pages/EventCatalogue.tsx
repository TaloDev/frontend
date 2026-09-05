import { IconCheck, IconPencil, IconX } from '@tabler/icons-react'
import { useAtomValue } from 'jotai'
import { useContext, useState } from 'react'
import { deleteEventRetention } from '../api/deleteEventRetention'
import { purgeEvents } from '../api/purgeEvents'
import { upsertEventRetention } from '../api/upsertEventRetention'
import useEventCatalogue from '../api/useEventCatalogue'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Page from '../components/Page'
import Pagination from '../components/Pagination'
import { SecondaryNav } from '../components/SecondaryNav'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import TextInput from '../components/TextInput'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { metaPropKeyMap } from '../constants/metaProps'
import { eventsSecondaryNavRoutes } from '../constants/secondaryNavRoutes'
import { CatalogueEvent } from '../entities/eventCatalogue'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'
import { AuthedUser, userState } from '../state/userState'
import buildError from '../utils/buildError'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'

const MIN_RETENTION_DAYS = 1

function EventCatalogue() {
  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame
  const [page, setPage] = useState(0)
  const { events, count, itemsPerPage, loading, error, mutate } = useEventCatalogue(
    activeGame,
    page,
  )
  const toast = useContext(ToastContext)
  const user = useAtomValue(userState) as AuthedUser
  const canPurge = canPerformAction(user, PermissionBasedAction.PURGE_EVENTS)
  const canChangeRetention = canPerformAction(user, PermissionBasedAction.CHANGE_EVENT_RETENTION)

  const [editingEventName, setEditingEventName] = useState<string | null>(null)
  const [retentionDaysInput, setRetentionDaysInput] = useState('')
  const [editingError, setEditingError] = useState<TaloError | null>(null)

  const retentionDays = Number(retentionDaysInput)
  const isValidRetention = Number.isInteger(retentionDays) && retentionDays >= MIN_RETENTION_DAYS

  const onStartEdit = (event: CatalogueEvent) => {
    setEditingEventName(event.name)
    setRetentionDaysInput(event.retentionDays?.toString() ?? '')
    setEditingError(null)
  }

  const onSaveRetention = async () => {
    if (!isValidRetention) {
      return
    }

    try {
      await upsertEventRetention(activeGame.id, editingEventName!, retentionDays)
      await mutate()
      toast.trigger('Retention updated', ToastType.SUCCESS)
      setEditingEventName(null)
    } catch (err) {
      setEditingError(buildError(err))
    }
  }

  const onClearRetention = async (event: CatalogueEvent) => {
    try {
      await deleteEventRetention(activeGame.id, event.name)
      await mutate()
      toast.trigger('Retention cleared', ToastType.SUCCESS)
    } catch (err) {
      setEditingError(buildError(err))
    }
  }

  const onPurge = async (event: CatalogueEvent) => {
    if (
      !window.confirm(
        `Are you sure you want to purge all '${event.name}' events? This action cannot be undone.`,
      )
    ) {
      return
    }

    try {
      const { purged } = await purgeEvents(activeGame.id, event.name)
      await mutate()
      setPage(0)
      toast.trigger(`Purged ${purged.toLocaleString()} events`, ToastType.SUCCESS)
    } catch {
      toast.trigger('Something went wrong while purging events', ToastType.ERROR)
    }
  }

  const onRetentionInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await onSaveRetention()
    } else if (e.key === 'Escape') {
      setEditingEventName(null)
    }
  }

  return (
    <Page
      title='Event catalogue'
      isLoading={loading}
      secondaryNav={<SecondaryNav routes={eventsSecondaryNavRoutes} />}
    >
      {error && <ErrorMessage error={error} />}
      {editingError && <ErrorMessage error={editingError} />}

      {events.length === 0 && !loading && !error && <p>No events found</p>}

      {events.length > 0 && (
        <>
          <Table
            columns={[
              'Event',
              'Total count',
              'Unique players',
              'Prop keys',
              'Retention',
              ...(canPurge ? [''] : []),
            ]}
          >
            <TableBody iterator={events}>
              {(event) => {
                const propKeys = event.propKeys.filter((key) => !(key in metaPropKeyMap))

                return (
                  <>
                    <TableCell>{event.name}</TableCell>
                    <TableCell className='font-mono'>{event.count.toLocaleString()}</TableCell>
                    <TableCell className='font-mono'>{event.players.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className='flex max-w-[240px] flex-wrap items-center gap-1 lg:max-w-[400px]'>
                        {propKeys.map((propKey) => (
                          <span
                            key={propKey}
                            className='max-w-full truncate rounded bg-gray-900 p-2 font-mono text-xs'
                          >
                            {propKey}
                          </span>
                        ))}
                        {propKeys.length === 0 && '-'}
                      </div>
                    </TableCell>
                    <TableCell className='w-64'>
                      <div className='flex items-center space-x-2'>
                        {editingEventName === event.name && (
                          <>
                            <TextInput
                              id={`edit-retention-${event.name}`}
                              type='number'
                              variant='light'
                              placeholder='Days'
                              containerClassName='w-24'
                              onChange={setRetentionDaysInput}
                              value={retentionDaysInput}
                              inputExtra={{
                                onKeyDown: onRetentionInputKeyDown,
                                min: MIN_RETENTION_DAYS,
                              }}
                            />
                            <Button
                              variant='icon'
                              className='rounded-full bg-indigo-900 p-1'
                              disabled={!isValidRetention}
                              onClick={onSaveRetention}
                              icon={<IconCheck size={16} />}
                              extra={{ 'aria-label': 'Save retention' }}
                            />
                            <Button
                              variant='icon'
                              className='rounded-full bg-indigo-900 p-1'
                              onClick={() => setEditingEventName(null)}
                              icon={<IconX size={16} />}
                              extra={{ 'aria-label': 'Cancel editing retention' }}
                            />
                          </>
                        )}
                        {editingEventName !== event.name && (
                          <>
                            <span>
                              {event.retentionDays ? `${event.retentionDays} days` : 'None'}
                            </span>
                            {canChangeRetention && (
                              <>
                                <Button
                                  variant='icon'
                                  className='rounded-full bg-indigo-900 p-1'
                                  onClick={() => onStartEdit(event)}
                                  icon={<IconPencil size={16} />}
                                  extra={{ 'aria-label': 'Edit retention' }}
                                />
                                {event.retentionDays && (
                                  <Button
                                    variant='icon'
                                    className='rounded-full bg-indigo-900 p-1'
                                    onClick={() => onClearRetention(event)}
                                    icon={<IconX size={16} />}
                                    extra={{ 'aria-label': 'Clear retention' }}
                                  />
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    {canPurge && (
                      <TableCell className='w-32'>
                        <Button variant='grey' onClick={() => onPurge(event)}>
                          <span>Purge</span>
                        </Button>
                      </TableCell>
                    )}
                  </>
                )
              }}
            </TableBody>
          </Table>

          <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />
        </>
      )}
    </Page>
  )
}

export default EventCatalogue
