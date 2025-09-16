import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import Loading from '../components/Loading'
import routes from '../constants/routes'
import { format } from 'date-fns'
import Pagination from '../components/Pagination'
import DateCell from '../components/tables/cells/DateCell'
import useLeaderboardEntries from '../api/useLeaderboardEntries'
import { IconArrowRight, IconPencil } from '@tabler/icons-react'
import Button from '../components/Button'
import updateLeaderboardEntry from '../api/updateLeaderboardEntry'
import buildError from '../utils/buildError'
import clsx from 'clsx'
import Page from '../components/Page'
import Table from '../components/tables/Table'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import findLeaderboard from '../api/findLeaderboard'
import { LeaderboardEntry } from '../entities/leaderboardEntry'
import { Leaderboard, LeaderboardRefreshInterval } from '../entities/leaderboard'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'
import userState, { AuthedUser } from '../state/userState'
import UpdateEntryScore from '../modals/UpdateEntryScore'
import Toggle from '../components/toggles/Toggle'
import Identifier from '../components/Identifier'
import { PropBadges } from '../components/PropBadges'
import useTimePeriodAndDates, { timePeriods } from '../utils/useTimePeriodAndDates'
import DateInput from '../components/DateInput'
import TimePeriodPicker from '../components/TimePeriodPicker'

export default function LeaderboardEntries() {
  const location = useLocation()
  const { internalName } = useParams()

  const [isLoading, setLoading] = useState(!location.state?.leaderboard)
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const [leaderboard, setLeaderboard] = useState<Leaderboard | undefined>(location.state?.leaderboard)

  const {
    timePeriod,
    setTimePeriod,
    selectedStartDate,
    selectedEndDate,
    onStartDateChange,
    onEndDateChange
  } = useTimePeriodAndDates(`${internalName}-entries`)

  const [page, setPage] = useState(0)
  const [withDeleted, setWithDeleted] = useState(false)
  const { entries, count, itemsPerPage, loading, error: fetchError, mutate } = useLeaderboardEntries({
    activeGame,
    leaderboardId: leaderboard?.id,
    page,
    withDeleted,
    startDate: selectedStartDate,
    endDate: selectedEndDate
  })

  const [error, setError] = useState<TaloError | null>(null)

  const navigate = useNavigate()

  const user = useRecoilValue(userState) as AuthedUser

  const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    (async () => {
      if (isLoading) {
        try {
          const { leaderboard } = await findLeaderboard(activeGame.id, internalName!)
          setLeaderboard(leaderboard)
          setLoading(false)
        } catch (err) {
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

  const onHideToggle = useCallback(async (entry: LeaderboardEntry) => {
    try {
      const { entry: updatedEntry } = await updateLeaderboardEntry(activeGame.id, leaderboard!.id, entry.id, { hidden: !entry.hidden })

      mutate((data) => {
        if (!data) {
          throw new Error('Leaderboard entry data not set')
        }

        return {
          ...data,
          entries: data.entries.map((existingEntry) => {
            if (existingEntry.id === entry.id) return { ...existingEntry, ...updatedEntry }
            return existingEntry
          })
        }
      }, false)
    } catch (err) {
      setError(buildError(err))
    }
  }, [activeGame.id, leaderboard, mutate])

  const onEntryUpdated = useCallback((entry: LeaderboardEntry) => {
    mutate((data) => {
      return {
        ...data!,
        entries: data!.entries.map((e) => e.id === entry.id ? entry : e)
      }
    })
  }, [mutate])

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
      {leaderboard?.refreshInterval !== LeaderboardRefreshInterval.NEVER &&
        <div className='flex items-center space-x-4 mt-0'>
          <div><Toggle id='include-archived' enabled={withDeleted} onToggle={setWithDeleted} /></div>
          <div>
            <p className='font-medium'>Show history</p>
            <p className='text-sm'>This will show entries not included in the {leaderboard?.refreshInterval} leaderboards</p>
          </div>
        </div>
      }

      <div className='justify-between items-start'>
        <div className='mb-4 md:mb-8'>
          <TimePeriodPicker
            periods={timePeriods}
            onPick={(period) => setTimePeriod(period.id)}
            selectedPeriod={timePeriod}
          />
        </div>

        <div className='flex items-end w-full md:w-1/2 space-x-4'>
          <div className='w-1/3'>
            <DateInput
              id='start-date'
              onDateTimeStringChange={onStartDateChange}
              value={selectedStartDate}
              textInputProps={{
                label: 'Start date',
                placeholder: 'Start date',
                errors: fetchError?.keys.startDate,
                variant: undefined
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
                variant: undefined
              }}
            />
          </div>
        </div>
      </div>

      {error && <ErrorMessage error={error} />}

      {!fetchError && entries.length === 0 &&
        <p>This leaderboard doesn&apos;t have any entries yet</p>
      }

      {!fetchError && entries.length > 0 &&
        <>
          <Table columns={['#', 'Player', 'Score', 'Props', 'Submitted at', ...(withDeleted ? [''] : []), ...(canUpdateEntry ? [''] : [])]}>
            <TableBody
              iterator={entries}
              configureClassnames={(entry, idx) => ({
                'bg-orange-600': entry.playerAlias.player.devBuild && idx % 2 !== 0,
                'bg-orange-500': entry.playerAlias.player.devBuild && idx % 2 === 0
              })}
            >
              {(entry) => (
                <>
                  <TableCell><span className='font-semibold'>{entry.position! + 1}</span></TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <span>{entry.playerAlias.identifier}</span>
                      <Button
                        variant='icon'
                        className={clsx('ml-2 p-1 rounded-full bg-indigo-900', { 'bg-orange-900': entry.playerAlias.player.devBuild })}
                        onClick={() => goToPlayer(entry.playerAlias.identifier)}
                        icon={<IconArrowRight size={16} />}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <span className='font-mono'>{entry.score.toLocaleString()}</span>
                      {canUpdateEntry &&
                        <Button
                          variant='icon'
                          className={clsx('p-1 rounded-full bg-indigo-900', { 'bg-orange-900': entry.playerAlias.player.devBuild })}
                          onClick={() => setEditingEntry(entry)}
                          icon={<IconPencil size={16} />}
                          extra={{ 'aria-label': 'Edit leaderboard entry' }}
                        />
                      }
                    </div>
                  </TableCell>
                  <TableCell className='w-[400px]'>
                    <PropBadges props={entry.props} className='flex flex-wrap space-y-0 gap-2' />
                  </TableCell>
                  <DateCell>
                    {format(new Date(entry.createdAt), 'dd MMM Y, HH:mm')}
                  </DateCell>
                  {withDeleted &&
                    <TableCell>
                      {entry.deletedAt && <Identifier id='Archived' />}
                    </TableCell>
                  }
                  {canUpdateEntry &&
                    <TableCell className='w-40'>
                      <Button
                        variant={entry.hidden ? 'black' : 'grey'}
                        onClick={() => onHideToggle(entry)}
                      >
                        <span>{entry.hidden ? 'Unhide' : 'Hide'}</span>
                      </Button>
                    </TableCell>
                  }
                </>
              )}
            </TableBody>
          </Table>

          {editingEntry &&
            <UpdateEntryScore
              modalState={[true, () => setEditingEntry(null)]}
              onEntryUpdated={onEntryUpdated}
              editingEntry={editingEntry}
              leaderboard={leaderboard!}
            />
          }

          {Boolean(count) && <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />}
        </>
      }
    </Page>
  )
}
