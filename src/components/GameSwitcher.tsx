import { IconChevronDown, IconPlus } from '@tabler/icons-react'
import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import randomColor from 'randomcolor'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import routes from '../constants/routes'
import { Game } from '../entities/game'
import NewGame from '../modals/NewGame'
import activeGameState from '../state/activeGameState'
import gamesState from '../state/gamesState'
import Button from './Button'

export default function GameSwitcher() {
  const [isOpen, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const games = useRecoilValue(gamesState)
  const [activeGame, setActiveGame] = useRecoilState(activeGameState)

  const navigate = useNavigate()

  const openModal = () => {
    setOpen(false)
    setShowModal(true)
  }

  const switchToGame = (game: Game) => {
    setActiveGame(game)
    setOpen(false)
    navigate(routes.dashboard)
  }

  const dropdownButtonStyle = 'hover:bg-gray-200 active:bg-gray-300 focus:z-10'

  return (
    <div className='relative z-50'>
      {activeGame && (
        <Tippy
          placement='bottom-start'
          visible={isOpen}
          onClickOutside={() => setOpen(false)}
          offset={[0, 0]}
          interactive={true}
          arrow={false}
          theme='bare'
          content={
            <motion.ul
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className='w-60 divide-y divide-gray-300 rounded-b bg-white text-black shadow md:w-80'
            >
              {games.map((game) => {
                const disabled = activeGame.id === game.id

                return (
                  <li
                    key={game.name}
                    className={clsx(dropdownButtonStyle, { ['bg-transparent!']: disabled })}
                  >
                    <Button
                      variant='bare'
                      disabled={disabled}
                      className='w-full truncate p-2'
                      onClick={() => switchToGame(game)}
                    >
                      {game.name}
                    </Button>
                  </li>
                )
              })}

              <li className={clsx('rounded-b', dropdownButtonStyle)}>
                <Button
                  variant='bare'
                  className='flex w-full items-center rounded-b p-2'
                  onClick={openModal}
                >
                  <div className='rounded-full bg-indigo-600 p-1'>
                    <IconPlus size={16} color='white' stroke={3} />
                  </div>
                  <span className='ml-2'>New game</span>
                </Button>
              </li>
            </motion.ul>
          }
        >
          <div
            className={clsx(
              'flex w-60 items-center justify-between rounded bg-indigo-300 p-2 lg:w-80',
              { 'rounded-b-none': isOpen },
            )}
          >
            <div className='flex items-center'>
              <span
                style={{
                  backgroundColor: randomColor({ seed: activeGame.name, luminosity: 'dark' }),
                }}
                className='h-8 w-8 rounded border-2 border-gray-900/30 bg-indigo-100 text-center leading-7 font-semibold text-white'
              >
                {activeGame.name.substring(0, 1).toUpperCase()}
              </span>
              <p className='ml-2 font-semibold'>{activeGame.name}</p>
            </div>

            <div className='ml-2 flex items-center md:ml-8'>
              <Button
                variant='icon'
                onClick={() => setOpen(!isOpen)}
                extra={{ 'aria-label': 'Switch games or create a new one' }}
              >
                <div className={clsx('transform transition-transform', { 'rotate-180': isOpen })}>
                  <IconChevronDown size={24} />
                </div>
              </Button>
            </div>
          </div>
        </Tippy>
      )}

      {!activeGame && (
        <Button
          onClick={() => setShowModal(true)}
          icon={<IconPlus size={16} color='white' stroke={3} />}
        >
          <span>New game</span>
        </Button>
      )}

      {showModal && <NewGame modalState={[showModal, setShowModal]} />}
    </div>
  )
}
