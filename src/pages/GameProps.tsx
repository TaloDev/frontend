import { IconPlus, IconTrash } from '@tabler/icons-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useAtom } from 'jotai'
import { useContext, useState } from 'react'
import { deleteScheduledGameConfigChange } from '../api/deleteScheduledGameConfigChange'
import { updateGameConfig } from '../api/updateGameConfig'
import { useScheduledGameConfigChanges } from '../api/useScheduledGameConfigChanges'
import Button from '../components/Button'
import { NoLiveConfig } from '../components/empty-states/NoLiveConfig'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import PropsEditor from '../components/PropsEditor'
import SecondaryTitle from '../components/SecondaryTitle'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { Prop } from '../entities/prop'
import { ScheduledGameConfigChange } from '../entities/scheduledGameConfigChange'
import ScheduleConfigChange from '../modals/ScheduleConfigChange'
import { activeGameState, SelectedActiveGameState } from '../state/activeGameState'

export default function GameProps() {
  const [activeGame, setActiveGame] = useAtom(activeGameState) as SelectedActiveGameState

  const toast = useContext(ToastContext)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  const {
    changes,
    loading: scheduledLoading,
    error: scheduledError,
    mutate,
  } = useScheduledGameConfigChanges(activeGame)

  const onSave = async (props: Prop[]): Promise<Prop[]> => {
    const { game } = await updateGameConfig(activeGame.id, props)

    toast.trigger('Live config updated', ToastType.SUCCESS)

    setActiveGame(game)
    return game.props
  }

  const onCancelChange = async (change: ScheduledGameConfigChange) => {
    if (
      !window.confirm(`Are you sure you want to cancel the scheduled change to '${change.key}'?`)
    ) {
      return
    }

    try {
      await deleteScheduledGameConfigChange(activeGame.id, change.id)
      await mutate()
      toast.trigger('Scheduled change cancelled', ToastType.SUCCESS)
    } catch {
      toast.trigger('Something went wrong while cancelling the change', ToastType.ERROR)
    }
  }

  return (
    <Page containerClassName='w-full lg:w-2/3' title={`${activeGame.name} config`}>
      <PropsEditor
        startingProps={activeGame.props}
        onSave={onSave}
        noPropsMessage={<NoLiveConfig />}
      />

      <div className='space-y-4'>
        <SecondaryTitle>Scheduled changes</SecondaryTitle>

        {scheduledError && <ErrorMessage error={scheduledError} />}

        {!scheduledError && !scheduledLoading && changes.length === 0 && (
          <p>
            No scheduled changes. Schedule a prop change to have it applied automatically at a
            future date.
          </p>
        )}

        {changes.length > 0 && (
          <Table columns={['Key', 'Value', 'Applies at', '']}>
            <TableBody iterator={changes}>
              {(change) => {
                const applyAt = new Date(change.applyAt)

                return (
                  <>
                    <TableCell className='min-w-40'>{change.key}</TableCell>
                    <TableCell className='min-w-40'>
                      {change.value ?? (
                        <code className='inline-block rounded bg-gray-900 p-2 align-middle text-xs'>
                          [Deleted]
                        </code>
                      )}
                    </TableCell>
                    <DateCell>
                      {format(applyAt, 'dd MMM yyyy, HH:mm')}
                      <span className='block text-xs'>
                        {formatDistanceToNow(applyAt, { addSuffix: true })}
                      </span>
                    </DateCell>
                    <TableCell className='w-40'>
                      <Button
                        variant='icon'
                        className='ml-auto rounded-full bg-indigo-900 p-1'
                        onClick={() => onCancelChange(change)}
                        icon={<IconTrash size={16} />}
                        extra={{ 'aria-label': `Cancel scheduled change to ${change.key}` }}
                      />
                    </TableCell>
                  </>
                )
              }}
            </TableBody>
          </Table>
        )}

        <Button onClick={() => setShowScheduleModal(true)} icon={<IconPlus size={16} />}>
          <span>Scheduled change</span>
        </Button>
      </div>

      {showScheduleModal && (
        <ScheduleConfigChange
          modalState={[showScheduleModal, setShowScheduleModal]}
          mutate={mutate}
        />
      )}
    </Page>
  )
}
