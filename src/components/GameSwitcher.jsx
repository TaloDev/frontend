import React, { useState } from 'react'
import { IconChevronDown, IconPlus } from '@tabler/icons'
import Button from './Button'
import classNames from 'classnames'
import NewGame from '../modals/NewGame'
import { useRecoilState, useRecoilValue } from 'recoil'
import gamesState from '../state/gamesState'
import activeGameState from '../state/activeGameState'
import randomColor from 'randomcolor'
import Tippy from '@tippyjs/react'
import { motion } from 'framer-motion'

const GameSwitcher = () => {
  const [isOpen, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const games = useRecoilValue(gamesState)
  const [activeGame, setActiveGame] = useRecoilState(activeGameState)

  const openModal = () => {
    setOpen(false)
    setShowModal(true)
  }

  const dropdownButtonStyle = 'hover:bg-gray-200 active:bg-gray-300 focus:z-10'

  return (
    <div className='relative z-50'>
      {activeGame &&
        <Tippy
          placement='bottom-start'
          visible={isOpen}
          onClickOutside={() => setOpen(false)}
          offset={[0, 0]}
          interactive={true}
          arrow={false}
          theme='bare'
          content={(
            <motion.ul
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className='bg-white text-black rounded-b w-60 md:w-80'
            >
              {games.map((game) => {
                const disabled = activeGame.id === game.id

                return (
                  <li key={game.name} className={classNames('border-b border-gray-300', dropdownButtonStyle, { ['!bg-transparent']: disabled })}>
                    <Button
                      variant='bare'
                      disabled={disabled}
                      className='truncate p-2 w-full'
                      onClick={() => setActiveGame(game)}
                    >
                      {game.name}
                    </Button>
                  </li>
                )
              })}

              <li className={`rounded-b ${dropdownButtonStyle}`}>
                <Button variant='bare' className='flex items-center rounded-b p-2 w-full' onClick={openModal}>
                  <div className='rounded-full p-1 bg-indigo-600'>
                    <IconPlus size={16} color='white' stroke={3} />
                  </div>
                  <span className='ml-2'>New game</span>
                </Button>
              </li>
            </motion.ul>
          )}
        >
          <div className={classNames('bg-indigo-300 rounded p-2 flex items-center justify-between w-60 md:w-80', { 'rounded-b-none': isOpen })}>
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
              <Button variant='icon' onClick={() => setOpen(!isOpen)} extra={{ 'aria-label': 'Switch games or create a new one' }}>
                <div className={classNames('transform transition-transform', { 'rotate-180': isOpen })}>
                  <IconChevronDown size={24} />
                </div>
              </Button>
            </div>
          </div>
        </Tippy>
      }

      {!activeGame &&
        <Button
          onClick={() => setShowModal(true)}
          icon={<IconPlus size={16} color='white' stroke={3} />}
        >
          <span>New game</span>
        </Button>
      }

      {showModal &&
        <NewGame modalState={[showModal, setShowModal]} />
      }
    </div>
  )
}

export default GameSwitcher
