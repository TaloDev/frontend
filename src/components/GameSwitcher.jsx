import React, { useState } from 'react'
import { IconChevronDown, IconPlus } from '@tabler/icons'
import Button from './Button'
import classNames from 'classnames'
import NewGame from '../modals/NewGame'
import { useRecoilState, useRecoilValue } from 'recoil'
import gamesState from '../atoms/gamesState'
import activeGameState from '../atoms/activeGameState'
import randomColor from 'randomcolor'

const GameSwitcher = () => {
  const [isOpen, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const games = useRecoilValue(gamesState)
  const [activeGame, setActiveGame] = useRecoilState(activeGameState)

  const dropdownButtonStyle = 'disabled:bg-transparent hover:bg-gray-200 active:bg-gray-300 focus:z-10'

  return (
    <div className='relative'>
      {activeGame &&
        <div className={classNames('bg-indigo-300 rounded p-2 flex items-center justify-between md:w-60', { 'rounded-b-none': isOpen })}>
          <div className='flex items-center'>
            <span
              style={{ backgroundColor: randomColor({ seed: activeGame.name, luminosity: 'dark' }) }}
              className='bg-indigo-100 rounded w-8 h-8 leading-7 text-center font-semibold text-white border-2 border-gray-900 border-opacity-30'
            >
              {activeGame.name.substring(0, 1).toUpperCase()}
            </span>
            <p className='font-semibold ml-2'>{activeGame.name}</p>
          </div>

          <div className='ml-2 md:ml-8 flex items-center'>
            <Button variant='icon' onClick={() => setOpen(!isOpen)}>
              <div className={classNames('transform transition-transform', { 'rotate-180': isOpen })}>
                <IconChevronDown size={24} />
              </div>
            </Button>
          </div>
        </div>
      }

      {!activeGame &&
        <div className='flex items-center'>
          <Button className='flex items-center' onClick={() => setShowModal(true)}>
            <IconPlus size={16} color='white' stroke={3} />
            <span className='ml-2'>New game</span>
          </Button>
        </div>
      }

      {isOpen &&
        <ul className='absolute bg-white w-full rounded-b -mt-0.5'>
          {games.map((game) => (
            <li key={game.name} className={`border-b border-gray-300 ${dropdownButtonStyle}`}>
              <Button
                variant='bare'
                disabled={activeGame.id === game.id}
                className='truncate p-2'
                onClick={() => setActiveGame(game)}
              >
                {game.name}
              </Button>
            </li>
          ))}

          <li className={`rounded-b ${dropdownButtonStyle}`}>
            <Button variant='bare' className='flex items-center rounded-b p-2' onClick={() => setShowModal(true)}>
              <div className='rounded-full p-1 bg-indigo-500'>
                <IconPlus size={16} color='white' stroke={3} />
              </div>
              <p className='ml-2'>New game</p>
            </Button>
          </li>
        </ul>
      }

      <NewGame modalState={[showModal, setShowModal]} />
    </div>
  )
}

export default GameSwitcher
