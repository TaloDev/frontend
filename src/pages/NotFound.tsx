import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Loading from '../components/Loading'
import { UnauthedContainer } from '../components/UnauthedContainer'
import { UnauthedContainerInner } from '../components/UnauthedContainerInner'
import routes from '../constants/routes'

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
    <UnauthedContainer>
      <UnauthedContainerInner>
        <h1 className='text-4xl font-bold'>404 Not Found</h1>
        <p>Sorry, we couldn&apos;t find that page. If this is a mistake, please contact us.</p>

        <Button onClick={() => navigate(routes.dashboard)}>Go to dashboard</Button>
      </UnauthedContainerInner>
    </UnauthedContainer>
  )
}
