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
import activeGameState from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import Button from '../components/Button'

export default function PlayerSaves() {
  const activeGame = useRecoilValue(activeGameState)

  const { id: playerId } = useParams()
  const [player] = usePlayer()

  const { saves, loading: savesLoading, error, errorStatusCode } = usePlayerSaves(activeGame, playerId)
  const sortedSaves = useSortedItems(saves, 'updatedAt')

  const navigate = useNavigate()

  const loading = !player || savesLoading

  useEffect(() => {
    if (errorStatusCode === 404) {
      navigate(routes.players, { replace: true })
    }
  }, [errorStatusCode])

  const viewSaveContent = (save) => {
    const path = routes.playerSaveContent
      .replace(':id', playerId)
      .replace(':saveId', save.id)

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
                <DateCell>{format(new Date(save.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                <DateCell>{format(new Date(save.updatedAt), 'dd MMM Y, HH:mm')}</DateCell>
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
