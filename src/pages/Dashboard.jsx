import { useRecoilState } from 'recoil'
import api from '../api/api'
import logout from '../api/logout'
import accessState from '../atoms/accessState'
import LinkButton from '../components/LinkButton'

const Dashboard = () => {
  const [, setAccessToken] = useRecoilState(accessState)

  const onLogoutClick = async () => {
    try {
      await logout()
      setAccessToken(null)
      api.interceptors.request.eject(0)
    } catch (err) {
      console.warn('Logout failed', err)
    }
  }

  return (
    <div className='h-full flex flex-row items-start'>
      <nav className='bg-gray-900 w-1/4 md:w-1/6 h-full p-2 md:p-8'>
        <ul>
          <li>
            <LinkButton onClick={onLogoutClick}>Logout</LinkButton>
          </li>
        </ul>
      </nav>
      <main className='bg-gray-800 w-3/4 md:w-5/6 h-full p-2 md:p-8 text-white'>
        <h1 className='text-4xl font-bold'>Hey there</h1>
      </main>
    </div>
  )
}

export default Dashboard
