import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import routes from '../constants/routes'
import usePlayerSaves from '../api/usePlayerSaves'
import { format } from 'date-fns'
import DateCell from '../components/tables/cells/DateCell'
import useSortedItems from '../utils/useSortedItems'
import PlayerIdentifier from '../components/PlayerIdentifier'
import Page from '../components/Page'
import usePlayer from '../utils/usePlayer'
import Table from '../components/tables/Table'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import Button from '../components/Button'
import { GameSave } from '../entities/gameSave'

export default function PlayerSaves() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { id: playerId } = useParams()
  const [player] = usePlayer()

  const { saves, loading: savesLoading, error, errorStatusCode } = usePlayerSaves(activeGame, playerId!)
  const sortedSaves = useSortedItems(saves, 'updatedAt')

  const navigate = useNavigate()

  const loading = !player || savesLoading

  useEffect(() => {
    if (errorStatusCode === 404) {
      navigate(routes.players, { replace: true })
    }
  }, [errorStatusCode, navigate])

  const viewSaveContent = (save: GameSave) => {
    const path = routes.playerSaveContent
      .replace(':id', playerId!)
      .replace(':saveId', save.id.toString())

    navigate(path, {
      state: {
        save
      }
    })
  }

  return (
    <Page
      showBackButton
      title='Player saves'
      isLoading={loading}
    >
      <PlayerIdentifier player={player} />

      {!error && !loading && sortedSaves.length === 0 &&
        <p>This player has not created any saves yet</p>
      }

      {!error && sortedSaves.length > 0 &&
        <Table columns={['Name', 'Created at', 'Updated at', '']}>
          <TableBody iterator={sortedSaves}>
            {(save) => (
              <>
                <TableCell className='min-w-60'>{save.name}</TableCell>
                <DateCell>{format(new Date(save.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                <DateCell>{format(new Date(save.updatedAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                <TableCell className='w-60'>
                  <Button variant='grey' onClick={() => viewSaveContent(save)}>View content</Button>
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
