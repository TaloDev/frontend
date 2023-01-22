import { useState } from 'react'
import { useRecoilState } from 'recoil'
import logout from '../api/logout'
import LinkButton from './LinkButton'
import Link from './Link'
import routes from '../constants/routes'
import GameSwitcher from './GameSwitcher'
import activeGameState from '../state/activeGameState'
import { IconMenu2 } from '@tabler/icons'
import MobileMenu from './MobileMenu'
import Button from './Button'
import ServicesLink from './ServicesLink'
import * as Sentry from '@sentry/react'

const NavBar = () => {
  const [activeGame, setActiveGame] = useRecoilState(activeGameState)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const onLogoutClick = async () => {
    try {
      /* istanbul ignore next */
      Sentry.configureScope((scope) => scope.setUser(null))
      setActiveGame(null)
      window.localStorage.removeItem('loggedOut')
      await logout()
    } catch (err) {
      console.warn('Logout failed:', err.message)
    } finally {
      window.location.href = routes.login
    }
  }

  const links = (
    <>
      <li>
        <Link to='/'>Home</Link>
      </li>
      {activeGame &&
        <ServicesLink />
      }
      <li>
        <Link to={routes.account}>Account</Link>
      </li>
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
