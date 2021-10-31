import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import logout from '../api/logout'
import LinkButton from './LinkButton'
import Link from './Link'
import routes from '../constants/routes'
import GameSwitcher from './GameSwitcher'
import activeGameState from '../state/activeGameState'
import userState from '../state/userState'
import userTypes from '../constants/userTypes'
import { IconMenu2 } from '@tabler/icons'
import MobileMenu from './MobileMenu'
import Button from './Button'

const NavBar = () => {
  const activeGame = useRecoilValue(activeGameState)
  const user = useRecoilValue(userState)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const onLogoutClick = async () => {
    try {
      await logout()
    } catch (err) {
      console.warn('Logout failed:', err.message)
    } finally {
      window.location.reload()
    }
  }

  const links = (
    <>
      <li>
        <Link to='/'>Home</Link>
      </li>
      {activeGame &&
        <>
          <li>
            <Link to={routes.players}>Players</Link>
          </li>
          <li>
            <Link to={routes.events}>Events</Link>
          </li>
          {user.type === userTypes.ADMIN &&
            <li>
              <Link to={routes.apiKeys}>Access keys</Link>
            </li>
          }
        </>
      }
      <li>
        <LinkButton onClick={onLogoutClick}>Logout</LinkButton>
      </li>
    </>
  )

  return (
    <nav className='bg-gray-900 w-full p-4 md:p-8 flex justify-between items-center'>
      <ul className='hidden md:flex space-x-4 md:space-x-8'>
        {links}
      </ul>

      <div className='flex mr-4 md:hidden text-white'>
        <Button
          variant='icon'
          onClick={() => setShowMobileMenu(true)}
          extra={{ 'aria-label': 'Navigation menu' }}
        >
          <IconMenu2 size={24} />
        </Button>
      </div>

      <MobileMenu visible={showMobileMenu} onClose={() => setShowMobileMenu(false)}>
        {links}
      </MobileMenu>

      <GameSwitcher />
    </nav>
  )
}

export default NavBar
