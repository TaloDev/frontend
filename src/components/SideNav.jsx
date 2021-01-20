import { useRecoilState } from 'recoil'
import api from '../api/api'
import logout from '../api/logout'
import accessState from '../atoms/accessState'
import LinkButton from '../components/LinkButton'
import Link from '../components/Link'
import routes from '../constants/routes'

const SideNav = () => {
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
    <nav className='bg-gray-900 w-1/4 md:w-1/6 h-full p-2 md:p-8'>
      <ul className='flex flex-col space-y-4'>
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
    </nav>
  )
}

export default SideNav
