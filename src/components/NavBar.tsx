import * as Sentry from '@sentry/react'
import { IconMenu2 } from '@tabler/icons-react'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import logout from '../api/logout'
import routes from '../constants/routes'
import activeGameState from '../state/activeGameState'
import Button from './Button'
import GameSwitcher from './GameSwitcher'
import Link from './Link'
import LinkButton from './LinkButton'
import MobileMenu from './MobileMenu'
import ServicesLink from './ServicesLink'

export default function NavBar() {
  const [activeGame, setActiveGame] = useRecoilState(activeGameState)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const onLogoutClick = async () => {
    try {
      /* v8ignore next */
      Sentry.setUser(null)
      setActiveGame(null)

      window.localStorage.removeItem('loggedOut')
      window.sessionStorage.removeItem('intendedRouteChecked')

      await logout()
    } catch (err) {
      console.warn('Logout failed:', (err as Error).message)
    } finally {
      window.location.href = routes.login
    }
  }

  const links = (
    <>
      <li>
        <Link to='/'>Home</Link>
      </li>
      {activeGame && <ServicesLink />}
      <li>
        <Link to={routes.account}>Account</Link>
      </li>
      <li>
        <LinkButton onClick={onLogoutClick}>Logout</LinkButton>
      </li>
    </>
  )

  return (
    <nav className='flex w-full items-center justify-between bg-gray-900 p-4 md:p-8'>
      <ul className='hidden space-x-4 md:flex md:space-x-8'>{links}</ul>

      <div className='mr-4 flex text-white md:hidden'>
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
