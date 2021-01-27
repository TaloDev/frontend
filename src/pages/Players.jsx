import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import getPlayers from '../api/getPlayers'
import activeGameState from '../atoms/activeGameState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import PlayerAliases from '../components/PlayerAliases'
import buildError from '../utils/buildError'
import { format } from 'date-fns'
import classNames from 'classnames'
import Title from '../components/Title'

const Players = () => {
  const [isLoading, setLoading] = useState(true)
  const [players, setPlayers] = useState([])
  const [error, setError] = useState(null)
  const activeGame = useRecoilValue(activeGameState)

  useEffect(() => {
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
  }, [])

  return (
    <div>
      <Title>Players {players.length > 0 && `(${players.length})`}</Title>

      {isLoading &&
        <div className='flex justify-center'>
          <Loading />
        </div>
      }

      <ErrorMessage error={error} />

      {players.length === 0 &&
        <p className='mt-4'>{activeGame.name} doesn't have any players yet.</p>
      }
 
      {players.length > 0 &&
        <div className='mt-4 rounded overflow-hidden'>
          <div className='grid grid-cols-4 gap-1 md:gap-2 p-2 md:p-4 bg-white text-black text-sm md:text-base font-semibold'>
            <span>Aliases</span>
            <span>Properties</span>
            <span>Registered</span>
            <span>Last seen</span>
          </div>
          <ul>
            {players.map((player, idx) => (
              <li key={player.id} className={classNames('grid grid-cols-4 gap-1 md:gap-2 p-2 md:p-4 text-sm items-center', { 'bg-indigo-600': idx % 2 !== 0, 'bg-indigo-500': idx % 2 === 0 })}>
                <span><PlayerAliases aliases={player.aliases} /></span>
                <span>{Object.keys(player.props ?? {}).length}</span>
                <span>
                  <span className='md:hidden'>{format(new Date(player.createdAt), 'MMM Y')}</span>
                  <span className='hidden md:block'>{format(new Date(player.createdAt), 'do MMM Y')}</span>
                </span>
                <span>
                  <span className='md:hidden'>{format(new Date(player.lastSeenAt), 'MMM Y')}</span>
                  <span className='hidden md:block'>{format(new Date(player.lastSeenAt), 'do MMM Y')}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      }
    </div>
  )
}

export default Players
