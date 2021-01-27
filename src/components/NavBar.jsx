import React from 'react'
import { useRecoilState } from 'recoil'
import api from '../api/api'
import logout from '../api/logout'
import accessState from '../atoms/accessState'
import LinkButton from './LinkButton'
import Link from './Link'
import routes from '../constants/routes'
import GameSwitcher from './GameSwitcher'

const NavBar = () => {
  const [, setAccessToken] = useRecoilState(accessState)

  const onLogoutClick = async () => {
    try {
      await logout()
    } catch (err) {
      console.warn('Logout failed', err)
    } finally {
      setAccessToken(null)
      api.interceptors.request.eject(0)
    }
  }

  return (
    <nav className='bg-gray-900 w-full p-4 md:p-8 flex justify-between'>
      <ul className='hidden md:flex space-x-4 md:space-x-8 items-center'>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to={routes.players}>Players</Link>
        </li>
        <li>
          <Link to={routes.events}>Events</Link>
        </li>
        <li>
          <LinkButton onClick={onLogoutClick}>Logout</LinkButton>
        </li>
      </ul>
      
      <GameSwitcher />
    </nav>
  )
}

export default NavBar
