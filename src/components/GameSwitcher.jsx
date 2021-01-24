import React, { useState } from 'react'
import { IconChevronDown, IconPlus } from '@tabler/icons'
import Button from './Button'
import classNames from 'classnames'
import NewGame from '../modals/NewGame'

const GameSwitcher = () => {
  const [isOpen, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const dropdownButtonStyle = 'p-2 hover:bg-gray-200 active:bg-gray-300'

  return (
    <div className='relative'>
      <div className={classNames('bg-indigo-400 rounded p-2 flex items-center', { 'rounded-b-none': isOpen })}>
        <div className='flex items-center'>
          <img src='https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/375290/7180cee0f8f58b728b99c0c77d64d655a2e7e145.jpg' className='bg-indigo-100 rounded w-8 h-8' />
          <p className='font-semibold ml-2'>Superstatic</p>
        </div>

        <div className='ml-2 md:ml-8 flex items-center'>
          <Button variant='icon' onClick={() => setOpen(!isOpen)}>
            <div className={classNames('transform transition-transform', { 'rotate-180': isOpen })}>
              <IconChevronDown size={24} />
            </div>
          </Button>
        </div>
      </div>

      {isOpen &&
        <ul className='absolute bg-white w-full rounded-b -mt-0.5'>
          <li>
            <Button variant='bare' className={`${dropdownButtonStyle} truncate`}>
              Crawle
            </Button>
          </li>
          <li className='border-t border-gray-300'>
            <Button variant='bare' className={`flex items-center rounded-b ${dropdownButtonStyle}`} onClick={() => setShowModal(true)}>
              <div className='rounded-full p-1 bg-indigo-500'>
                <IconPlus size={12} color='white' stroke={3} />
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
