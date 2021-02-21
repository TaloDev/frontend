import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import getPlayers from '../api/getPlayers'
import activeGameState from '../state/activeGameState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import PlayerAliases from '../components/PlayerAliases'
import buildError from '../utils/buildError'
import { format } from 'date-fns'
import classNames from 'classnames'
import Title from '../components/Title'
import { IconArrowRight } from '@tabler/icons'
import Button from '../components/Button'
import { useHistory } from 'react-router-dom'
import routes from '../constants/routes'
import TextInput from '../components/TextInput'

const Players = () => {
  const [isLoading, setLoading] = useState(true)
  const [players, setPlayers] = useState([])
  const [error, setError] = useState(null)
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
                label='Search'
                placeholder='Search...'
              />
            </div>
          </div>
          <div className='overflow-x-scroll'>
            <table className='table-auto w-full'>
              <thead className='bg-white text-black font-semibold'>
                <tr>
                  {['Aliases', 'Properties', 'Registered', 'Last seen'].map((col) => (
                    <th key={col} className='p-4 text-left'>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((player, idx) => (
                  <tr key={player.id} className={classNames({ 'bg-indigo-600': idx % 2 !== 0, 'bg-indigo-500': idx % 2 === 0 })}>
                    <td className='p-4 min-w-40'><PlayerAliases aliases={player.aliases} /></td>
                    <td className='p-4 min-w-40 flex items-center'>
                      {Object.keys(player.props).length}
                      <Button
                        variant='icon'
                        className='ml-2 p-1 rounded-full bg-indigo-900'
                        onClick={() => {
                          history.push({
                            pathname: routes.playerProps.replace(':id', player.id),
                            state: { player }
                          })
                        }}
                      >
                        <IconArrowRight size={16} />
                      </Button>
                    </td>
                    <td className='p-4 min-w-40'>{format(new Date(player.createdAt), 'do MMM Y')}</td>
                    <td className='p-4 min-w-40'>{format(new Date(player.lastSeenAt), 'do MMM Y')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  )
}

export default Players
