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
import activeGameState from '../state/activeGameState'
import useLeaderboards from '../api/useLeaderboards'
import usePlayerLeaderboardEntries from '../api/usePlayerLeaderboardEntries'
import Button from '../components/Button'
import { IconArrowRight } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'
import PlayerAliases from '../components/PlayerAliases'

export default function PlayerLeaderboardEntries() {
  const activeGame = useRecoilValue(activeGameState)

  const [player] = usePlayer()
  const navigate = useNavigate()

  const { leaderboards, loading: leaderboardsLoading, error: leaderboardsError } = useLeaderboards(activeGame)
  const { entries, loading: entriesLoading, error: entriesError } = usePlayerLeaderboardEntries(activeGame, leaderboards, player)

  const error = leaderboardsError || entriesError
  const loading = !player || leaderboardsLoading || entriesLoading

  const goToLeaderboard = (internalName) => {
    navigate(routes.leaderboardEntries.replace(':internalName', internalName), {
      state: { player }
    })
  }

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
        <Table columns={['Leaderboard', 'Alias', 'Score', 'Submitted at']}>
          <TableBody iterator={entries}>
            {(entry) => (
              <>
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
                <TableCell>{entry.score}</TableCell>
                <DateCell>{format(new Date(entry.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
              </>
            )}
          </TableBody>
        </Table>
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
