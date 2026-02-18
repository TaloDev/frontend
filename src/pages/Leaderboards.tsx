import { useCallback, useEffect, useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import { format } from 'date-fns'
import DateCell from '../components/tables/cells/DateCell'
import useLeaderboards from '../api/useLeaderboards'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { IconChevronUp, IconChevronDown, IconPlus } from '@tabler/icons-react'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'
import LeaderboardDetails from '../modals/LeaderboardDetails'
import useSortedItems from '../utils/useSortedItems'
import Page from '../components/Page'
import Table from '../components/tables/Table'
import { Leaderboard } from '../entities/leaderboard'
import { ResetLeaderboardEntries } from '../modals/ResetLeaderboardEntries'
import { NewLeaderboardEntriesChart } from '../components/charts/NewLeaderboardEntriesChart'

export default function Leaderboards() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [editingLeaderboard, setEditingLeaderboard] = useState<Leaderboard | null>(null)

  const { leaderboards, loading, error, mutate } = useLeaderboards(activeGame)

  const sortedLeaderboards = useSortedItems(leaderboards, 'createdAt')

  useEffect(() => {
    if (!showModal && !showResetModal) setEditingLeaderboard(null)
  }, [showModal, showResetModal])

  const goToEntries = useCallback((leaderboard: Leaderboard) => {
    navigate(routes.leaderboardEntries.replace(':internalName', leaderboard.internalName), {
      state: { leaderboard }
    })
  }, [navigate])

  const onEditLeaderboardClick = useCallback((leaderboard: Leaderboard) => {
    setEditingLeaderboard(leaderboard)
    setShowModal(true)
  }, [])

  const onResetLeaderboardClick = useCallback(() => {
    setShowModal(false)
    setShowResetModal(true)
  }, [])

  const onResetLeaderboardCloseClick = useCallback((close: boolean) => {
    setShowResetModal(false)
    if (!close) {
      setShowModal(true)
    }
  }, [])

  return (
    <Page
      title='Leaderboards'
      isLoading={loading}
      extraTitleComponent={
        <div className='mt-1 ml-4 p-1 rounded-full bg-indigo-600'>
          <Button
            variant='icon'
            onClick={() => setShowModal(true)}
            icon={<IconPlus />}
            extra={{ 'aria-label': 'Create leaderboard' }}
          />
        </div>
      }
    >
      <NewLeaderboardEntriesChart />

      {!error && !loading && leaderboards.length === 0 &&
        <p>{activeGame.name} doesn&apos;t have any leaderboards yet</p>
      }

      {!error && leaderboards.length > 0 &&
        <Table columns={['Internal name', 'Display name', 'Sort mode', 'Unique entries', 'Refresh', 'Created at', 'Updated at', '', '']}>
          <TableBody iterator={sortedLeaderboards}>
            {(leaderboard) => (
              <>
                <TableCell>{leaderboard.internalName}</TableCell>
                <TableCell>{leaderboard.name}</TableCell>
                <TableCell>
                  {leaderboard.sortMode === 'asc'
                    ? <span><IconChevronUp className='inline-block mr-1 mb-0.5' /> Ascending</span>
                    : <span><IconChevronDown className='inline-block mr-1' /> Descending</span>
                  }
                </TableCell>
                <TableCell>{leaderboard.unique ? 'Yes' : 'No'}</TableCell>
                <TableCell className='capitalize'>{leaderboard.refreshInterval}</TableCell>
                <DateCell>{format(new Date(leaderboard.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                <DateCell>{format(new Date(leaderboard.updatedAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                <TableCell className='w-40'>
                  <Button variant='grey' onClick={() => goToEntries(leaderboard)}>View entries</Button>
                </TableCell>
                <TableCell className='w-40'>
                  <Button variant='grey' onClick={() => onEditLeaderboardClick(leaderboard)}>Edit</Button>
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      }

      {error && <ErrorMessage error={error} />}

      {showModal &&
        <LeaderboardDetails
          modalState={[showModal, setShowModal]}
          mutate={mutate}
          editingLeaderboard={editingLeaderboard}
          onResetClick={onResetLeaderboardClick}
        />
      }
      {showResetModal &&
        <ResetLeaderboardEntries
          modalState={[showResetModal, onResetLeaderboardCloseClick]}
          editingLeaderboard={editingLeaderboard}
        />
      }
    </Page>
  )
}
