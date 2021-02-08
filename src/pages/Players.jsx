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

const Players = () => {
  const [isLoading, setLoading] = useState(true)
  const [players, setPlayers] = useState([])
  const [error, setError] = useState(null)
  const activeGame = useRecoilValue(activeGameState)

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
        <div className='overflow-x-scroll'>
          <div className='flex items-start p-4 bg-white text-black font-semibold w-min rounded-t'>
            {['Aliases', 'Properties', 'Registered', 'Last seen'].map((col) => (
              <span key={col} className='min-w-60'>{col}</span>
            ))}
          </div>
          <ul className='w-min rounded-b overflow-hidden'>
            {players.map((player, idx) => (
              <li key={player.id} className={classNames('flex items-center p-4 w-min', { 'bg-indigo-600': idx % 2 !== 0, 'bg-indigo-500': idx % 2 === 0 })}>
                <span className='min-w-60'><PlayerAliases aliases={player.aliases} /></span>
                <span className='min-w-60 flex items-center'>
                  {Object.keys(player.props).length}
                  <Button
                    variant='icon'
                    className='ml-2 p-1 rounded-full bg-indigo-900'
                    onClick={() => console.log('hi')}
                  >
                    <IconArrowRight size={16} />
                  </Button>
                </span>
                <span className='min-w-60'>{format(new Date(player.createdAt), 'do MMM Y')}</span>
                <span className='min-w-60'>{format(new Date(player.lastSeenAt), 'do MMM Y')}</span>
              </li>
            ))}
          </ul>
        </div>
      }
    </div>
  )
}

export default Players
