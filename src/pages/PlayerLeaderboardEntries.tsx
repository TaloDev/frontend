import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import { format } from 'date-fns'
import DateCell from '../components/tables/cells/DateCell'
import Page from '../components/Page'
import PlayerIdentifier from '../components/PlayerIdentifier'
import usePlayer from '../utils/usePlayer'
import Table from '../components/tables/Table'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import useLeaderboards from '../api/useLeaderboards'
import usePlayerLeaderboardEntries from '../api/usePlayerLeaderboardEntries'
import Button from '../components/Button'
import { IconArrowRight, IconPencil } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'
import PlayerAliases from '../components/PlayerAliases'
import { PermissionBasedAction } from '../utils/canPerformAction'
import canPerformAction from '../utils/canPerformAction'
import userState from '../state/userState'
import { AuthedUser } from '../state/userState'
import { useCallback, useState } from 'react'
import { LeaderboardEntry } from '../entities/leaderboardEntry'
import UpdateEntryScore from '../modals/UpdateEntryScore'

export default function PlayerLeaderboardEntries() {
  const user = useRecoilValue(userState) as AuthedUser
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null)

  const [player] = usePlayer()
  const navigate = useNavigate()

  const { leaderboards, loading: leaderboardsLoading, error: leaderboardsError } = useLeaderboards(activeGame)
  const { entries, loading: entriesLoading, error: entriesError, mutate } = usePlayerLeaderboardEntries(activeGame, leaderboards, player)

  const error = leaderboardsError || entriesError
  const loading = !player || leaderboardsLoading || entriesLoading

  const goToLeaderboard = (internalName: string) => {
    navigate(routes.leaderboardEntries.replace(':internalName', internalName))
  }

  const onEntryUpdated = useCallback((entry: LeaderboardEntry) => {
    mutate((data) => {
      return {
        ...data,
        entries: data!.entries.map((e) => e.id === entry.id ? entry : e)
      }
    })
  }, [mutate])

  return (
    <Page
      showBackButton
      title='Player leaderboard entries'
      isLoading={loading}
    >
      <PlayerIdentifier player={player} />

      {!error && !loading && entries.length === 0 &&
        <p>This player has no leaderboard entries yet</p>
      }

      {!error && entries.length > 0 &&
        <Table columns={['#', 'Leaderboard', 'Alias', 'Score', 'Submitted at']}>
          <TableBody iterator={entries}>
            {(entry) => (
              <>
                <TableCell><span className='font-semibold'>{entry.position! + 1}</span></TableCell>
                <TableCell>
                  <div className='flex items-center'>
                    <span>{entry.leaderboardName}</span>
                    <Button
                      variant='icon'
                      className='ml-2 p-1 rounded-full bg-indigo-900'
                      onClick={() => goToLeaderboard(entry.leaderboardInternalName)}
                      icon={<IconArrowRight size={16} />}
                    />
                  </div>
                </TableCell>
                <TableCell className='min-w-60'><PlayerAliases aliases={[entry.playerAlias]} /></TableCell>
                <TableCell className='flex items-center space-x-2'>
                  <span>{entry.score}</span>
                  {canPerformAction(user, PermissionBasedAction.UPDATE_LEADERBOARD_ENTRY) &&
                    <Button
                      variant='icon'
                      className='p-1 rounded-full bg-indigo-900'
                      onClick={() => setEditingEntry(entry)}
                      icon={<IconPencil size={16} />}
                      extra={{ 'aria-label': 'Edit leaderboard entry' }}
                    />
                  }
                </TableCell>
                <DateCell>{format(new Date(entry.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
              </>
            )}
          </TableBody>
        </Table>
      }

      {editingEntry &&
        <UpdateEntryScore
          modalState={[true, () => setEditingEntry(null)]}
          onEntryUpdated={onEntryUpdated}
          editingEntry={editingEntry}
          leaderboard={leaderboards.find((leaderboard) => {
            return leaderboard.internalName === editingEntry.leaderboardInternalName
          })!}
        />
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
