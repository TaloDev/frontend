import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import getPlayers from '../api/getPlayers'
import activeGameState from '../state/activeGameState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import PlayerAliases from '../components/PlayerAliases'
import buildError from '../utils/buildError'
import { format } from 'date-fns'
import Title from '../components/Title'
import { IconArrowRight } from '@tabler/icons'
import Button from '../components/Button'
import { useHistory } from 'react-router-dom'
import routes from '../constants/routes'
import TextInput from '../components/TextInput'
import TableHeader from '../components/tables/TableHeader'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'

const Players = () => {
  const [isLoading, setLoading] = useState(true)
  const [players, setPlayers] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const activeGame = useRecoilValue(activeGameState)
  const history = useHistory()

  useEffect(() => {
    if (activeGame) {
      (async () => {
        try {
          const res = await getPlayers(activeGame.id)
          setPlayers(res.data.players)
        } catch (err) {
          setError(buildError(err))
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [activeGame])

  const goToPlayerProps = (player) => {
    history.push({
      pathname: routes.playerProps.replace(':id', player.id),
      state: { player }
    })
  }

  return (
    <div className='space-y-4 md:space-y-8'>
      <Title>Players {players.length > 0 && `(${players.length})`}</Title>

      {isLoading &&
        <div className='flex justify-center'>
          <Loading />
        </div>
      }

      {error && <ErrorMessage error={error} />}

      {players.length === 0 && !isLoading &&
        <p>{activeGame.name} doesn't have any players yet.</p>
      }
 
      {players.length > 0 &&
        <div className='rounded overflow-hidden border-2 border-gray-700'>
          <div className='p-4'>
            <div className='w-1/2 lg:w-1/4'>
              <TextInput
                id='players-search'
                label='Search'
                placeholder='Search...'
                onChange={setSearch}
                value={search}
              />
            </div>
          </div>
          <div className='overflow-x-scroll'>
            <table className='table-auto w-full'>
              <TableHeader columns={['Aliases', 'Properties', 'Registered', 'Last seen']} />
              <TableBody iterator={players}>
                {(player) => (
                  <>
                    <TableCell><PlayerAliases aliases={player.aliases} /></TableCell>
                    <TableCell className='flex items-center'>
                      {Object.keys(player.props).length}
                      <Button
                        variant='icon'
                        className='ml-2 p-1 rounded-full bg-indigo-900'
                        onClick={() => goToPlayerProps(player)}
                        icon={<IconArrowRight size={16} />}
                      />
                    </TableCell>
                    <TableCell>{format(new Date(player.createdAt), 'do MMM Y')}</TableCell>
                    <TableCell>{format(new Date(player.lastSeenAt), 'do MMM Y')}</TableCell>
                  </>
                )}
              </TableBody>
            </table>
          </div>
        </div>
      }
    </div>
  )
}

export default Players
