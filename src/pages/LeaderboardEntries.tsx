import { IconArrowRight, IconPencil } from '@tabler/icons-react'
import clsx from 'clsx'
import { format } from 'date-fns'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import findLeaderboard from '../api/findLeaderboard'
import updateLeaderboardEntry from '../api/updateLeaderboardEntry'
import useLeaderboardEntries from '../api/useLeaderboardEntries'
import Button from '../components/Button'
import DateInput from '../components/DateInput'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Identifier from '../components/Identifier'
import Loading from '../components/Loading'
import Page from '../components/Page'
import Pagination from '../components/Pagination'
import { PropBadges } from '../components/PropBadges'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import TimePeriodPicker from '../components/TimePeriodPicker'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import Toggle from '../components/toggles/Toggle'
import routes from '../constants/routes'
import { Leaderboard, LeaderboardRefreshInterval } from '../entities/leaderboard'
import { LeaderboardEntry } from '../entities/leaderboardEntry'
import UpdateEntryScore from '../modals/UpdateEntryScore'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState, { AuthedUser } from '../state/userState'
import buildError from '../utils/buildError'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'
import useTimePeriodAndDates, { timePeriods } from '../utils/useTimePeriodAndDates'

export default function LeaderboardEntries() {
  const location = useLocation()
  const { internalName } = useParams()

  const [isLoading, setLoading] = useState(!location.state?.leaderboard)
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const [leaderboard, setLeaderboard] = useState<Leaderboard | undefined>(
    location.state?.leaderboard,
  )

  const {
    timePeriod,
    setTimePeriod,
    selectedStartDate,
    selectedEndDate,
    onStartDateChange,
    onEndDateChange,
  } = useTimePeriodAndDates(`${internalName}-entries`)

  const [page, setPage] = useState(0)
  const [withDeleted, setWithDeleted] = useState(false)
  const {
    entries,
    count,
    itemsPerPage,
    loading,
    error: fetchError,
    mutate,
  } = useLeaderboardEntries({
    activeGame,
    leaderboardId: leaderboard?.id,
    page,
    withDeleted,
    startDate: selectedStartDate,
    endDate: selectedEndDate,
  })

  const [error, setError] = useState<TaloError | null>(null)

  const navigate = useNavigate()

  const user = useRecoilValue(userState) as AuthedUser

  const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null)

  const toast = useContext(ToastContext)

  useEffect(() => {
    void (async () => {
      if (isLoading) {
        try {
          const { leaderboards } = await findLeaderboard(activeGame.id, internalName!)
          if (!leaderboards[0]) {
            throw new Error('Leaderboard not found')
          }
          setLeaderboard(leaderboards[0])
          setLoading(false)
        } catch {
          navigate(routes.leaderboards, { replace: true })
        }
      }
    })()
  }, [activeGame.id, internalName, isLoading, navigate])

  useEffect(() => {
    setError(fetchError)
  }, [fetchError])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const goToPlayer = (identifier: string) => {
    navigate(`${routes.players}?search=${identifier}`)
  }

  const onHideToggle = useCallback(
    async (entry: LeaderboardEntry) => {
      try {
        const { entry: updatedEntry } = await updateLeaderboardEntry(
          activeGame.id,
          leaderboard!.id,
          entry.id,
          { hidden: !entry.hidden },
        )

        await mutate((data) => {
          if (!data) {
            throw new Error('Leaderboard entry data not set')
          }

          return {
            ...data,
            entries: data.entries.map((existingEntry) => {
              if (existingEntry.id === entry.id) return { ...existingEntry, ...updatedEntry }
              return existingEntry
            }),
          }
        }, false)

        toast.trigger(
          `Leaderboard entry ${updatedEntry.hidden ? 'hidden' : 'unhidden'}`,
          updatedEntry.hidden ? ToastType.NONE : ToastType.SUCCESS,
        )
      } catch (err) {
        setError(buildError(err))
      }
    },
    [activeGame.id, leaderboard, mutate, toast],
  )

  const onEntryUpdated = useCallback(
    async (entry: LeaderboardEntry) => {
      await mutate((data) => {
        return {
          ...data!,
          entries: data!.entries.map((e) => (e.id === entry.id ? entry : e)),
        }
      })
    },
    [mutate],
  )

  if (isLoading) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  const canUpdateEntry = canPerformAction(user, PermissionBasedAction.UPDATE_LEADERBOARD_ENTRY)

  return (
    <Page
      showBackButton
      title={leaderboard ? `${leaderboard.name} entries` : ''}
      isLoading={loading}
    >
      {leaderboard?.refreshInterval !== LeaderboardRefreshInterval.NEVER && (
        <div className='mt-0 flex items-center space-x-4'>
          <div>
            <Toggle id='include-archived' enabled={withDeleted} onToggle={setWithDeleted} />
          </div>
          <div>
            <p className='font-medium'>Show history</p>
            <p className='text-sm'>
              This will show entries not included in the {leaderboard?.refreshInterval} leaderboards
            </p>
          </div>
        </div>
      )}

      <div>
        <div className='mb-4 md:mb-8'>
          <TimePeriodPicker
            periods={timePeriods}
            onPick={(period) => setTimePeriod(period.id)}
            selectedPeriod={timePeriod}
          />
        </div>

        <div className='flex w-full items-end space-x-4 md:w-1/2'>
          <div className='w-1/3'>
            <DateInput
              id='start-date'
              onDateTimeStringChange={onStartDateChange}
              value={selectedStartDate}
              textInputProps={{
                label: 'Start date',
                placeholder: 'Start date',
                errors: fetchError?.keys.startDate,
                variant: undefined,
              }}
            />
          </div>

          <div className='w-1/3'>
            <DateInput
              id='end-date'
              onDateTimeStringChange={onEndDateChange}
              value={selectedEndDate}
              textInputProps={{
                label: 'End date',
                placeholder: 'End date',
                errors: fetchError?.keys.endDate,
                variant: undefined,
              }}
            />
          </div>
        </div>
      </div>

      {error && <ErrorMessage error={error} />}

      {!fetchError && entries.length === 0 && (
        <p>This leaderboard doesn&apos;t have any entries yet</p>
      )}

      {!fetchError && entries.length > 0 && (
        <>
          <Table
            columns={[
              '#',
              'Player',
              'Score',
              'Props',
              'Submitted at',
              ...(withDeleted ? [''] : []),
              ...(canUpdateEntry ? [''] : []),
            ]}
          >
            <TableBody
              iterator={entries}
              configureClassnames={(entry, idx) => ({
                'bg-orange-600': entry.playerAlias.player.devBuild && idx % 2 !== 0,
                'bg-orange-500': entry.playerAlias.player.devBuild && idx % 2 === 0,
              })}
            >
              {(entry) => (
                <>
                  <TableCell>
                    <span className='font-semibold'>{entry.position! + 1}</span>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <span>{entry.playerAlias.identifier}</span>
                      <Button
                        variant='icon'
                        className={clsx('ml-2 rounded-full bg-indigo-900 p-1', {
                          'bg-orange-900': entry.playerAlias.player.devBuild,
                        })}
                        onClick={() => goToPlayer(entry.playerAlias.identifier)}
                        icon={<IconArrowRight size={16} />}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <span className='font-mono'>{entry.score.toLocaleString()}</span>
                      {canUpdateEntry && (
                        <Button
                          variant='icon'
                          className={clsx('rounded-full bg-indigo-900 p-1', {
                            'bg-orange-900': entry.playerAlias.player.devBuild,
                          })}
                          onClick={() => setEditingEntry(entry)}
                          icon={<IconPencil size={16} />}
                          extra={{ 'aria-label': 'Edit leaderboard entry' }}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='w-100'>
                    <PropBadges props={entry.props} className='flex flex-wrap gap-2 space-y-0' />
                  </TableCell>
                  <DateCell>{format(new Date(entry.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                  {withDeleted && (
                    <TableCell>{entry.deletedAt && <Identifier id='Archived' />}</TableCell>
                  )}
                  {canUpdateEntry && (
                    <TableCell className='w-40'>
                      <Button
                        variant={entry.hidden ? 'black' : 'grey'}
                        onClick={() => onHideToggle(entry)}
                      >
                        <span>{entry.hidden ? 'Unhide' : 'Hide'}</span>
                      </Button>
                    </TableCell>
                  )}
                </>
              )}
            </TableBody>
          </Table>

          {editingEntry && (
            <UpdateEntryScore
              modalState={[true, () => setEditingEntry(null)]}
              onEntryUpdated={onEntryUpdated}
              editingEntry={editingEntry}
              leaderboard={leaderboard!}
            />
          )}

          {Boolean(count) && (
            <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />
          )}
        </>
      )}
    </Page>
  )
}
