import React from 'react'
import { useRecoilState } from 'recoil'
import api from '../api/api'
import logout from '../api/logout'
import accessState from '../atoms/accessState'
import LinkButton from './LinkButton'
import Link from './Link'
import routes from '../constants/routes'
import { IconChevronDown } from '@tabler/icons'
import Button from './Button'

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
      <ul className='flex space-x-4 md:space-x-8 items-center'>
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
      <div className='bg-indigo-400 rounded p-2 flex items-center'>
        <div className='flex items-center'>
          <img src='https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/375290/7180cee0f8f58b728b99c0c77d64d655a2e7e145.jpg' className='bg-indigo-100 rounded w-8 h-8' />
          <p className='font-semibold ml-2 hidden md:inline'>Superstatic</p>
        </div>

        <div className='ml-2 md:ml-8 flex items-center'>
          <Button variant='icon'>
            <IconChevronDown 
              size={24}
              color='black'
            />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
