import { IconPencil } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import usePlayerStats from '../api/usePlayerStats'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import PlayerIdentifier from '../components/PlayerIdentifier'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import routes from '../constants/routes'
import { PlayerGameStat } from '../entities/playerGameStat'
import UpdateStatValue from '../modals/UpdateStatValue'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState from '../state/userState'
import { AuthedUser } from '../state/userState'
import { PermissionBasedAction } from '../utils/canPerformAction'
import canPerformAction from '../utils/canPerformAction'
import usePlayer from '../utils/usePlayer'
import useSortedItems from '../utils/useSortedItems'

export default function PlayerStats() {
  const user = useRecoilValue(userState) as AuthedUser
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { id: playerId } = useParams()
  const [player] = usePlayer()

  const {
    stats,
    loading: statsLoading,
    error,
    errorStatusCode,
    mutate,
  } = usePlayerStats(activeGame, playerId!)
  const sortedStats = useSortedItems(stats, 'updatedAt')

  const navigate = useNavigate()

  const loading = !player || statsLoading

  const [editingStat, setEditingStat] = useState<PlayerGameStat | null>(null)

  useEffect(() => {
    if (errorStatusCode === 404) {
      navigate(routes.players, { replace: true })
    }
  }, [errorStatusCode, navigate])

  return (
    <Page showBackButton title='Player stats' isLoading={loading}>
      <PlayerIdentifier player={player} />

      {!error && !loading && sortedStats.length === 0 && <p>This player has no stat entries yet</p>}

      {!error && sortedStats.length > 0 && (
        <Table columns={['Stat', 'Value', 'Created at', 'Updated at']}>
          <TableBody iterator={sortedStats}>
            {(playerStat) => (
              <>
                <TableCell className='min-w-60'>{playerStat.stat.name}</TableCell>
                <TableCell className='flex min-w-40 items-center space-x-2'>
                  <>
                    <span>{playerStat.value}</span>
                    {canPerformAction(user, PermissionBasedAction.UPDATE_PLAYER_STAT) && (
                      <Button
                        variant='icon'
                        className='rounded-full bg-indigo-900 p-1'
                        onClick={() => setEditingStat(playerStat)}
                        icon={<IconPencil size={16} />}
                        extra={{ 'aria-label': 'Edit game name' }}
                      />
                    )}
                  </>
                </TableCell>
                <DateCell>{format(new Date(playerStat.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                <DateCell>{format(new Date(playerStat.updatedAt), 'dd MMM yyyy, HH:mm')}</DateCell>
              </>
            )}
          </TableBody>
        </Table>
      )}

      {editingStat && (
        <UpdateStatValue
          modalState={[true, () => setEditingStat(null)]}
          mutate={mutate}
          editingStat={editingStat}
        />
      )}

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
