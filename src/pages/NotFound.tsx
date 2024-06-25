import Button from '../components/Button'
import { unauthedContainerStyle } from '../styles/theme'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'
import { useEffect, useState } from 'react'
import Loading from '../components/Loading'

export default function NotFound() {
  const navigate = useNavigate()

  const [routeChecked, setRouteChcked] = useState(false)

  useEffect(() => {
    // e.g. /demo doesn't exist post-auth but it was a real route pre-auth
    if (Object.values(routes).includes(window.location.pathname)) {
      navigate(routes.dashboard)
    } else {
      setRouteChcked(true)
    }
  }, [navigate])

  if (!routeChecked) {
    return <Loading />
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <div className={`text-white space-y-8 ${unauthedContainerStyle}`}>
        <h1 className='text-4xl font-bold'>404 Not Found</h1>
        <p>
          Sorry, we couldn&apos;t find that page. If this is a mistake, please contact us.
        </p>

        <Button
          onClick={() => navigate(routes.dashboard)}
        >
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}
