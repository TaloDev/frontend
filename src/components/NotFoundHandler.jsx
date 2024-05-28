import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

// 1. user hits dashboard.trytalo.com/leaderboards but is logged out
// 2. user is redirected to dashboard.trytalo.com/login?next=%2Fleaderboards
// 3. "next" search param is put into sessionStorage
// 4. user logs in, /login is no longer a route so is redirected to dashboard.trytalo.com/?next=%2Fleaderboards
// 5. useIntendedRoute hook picks up logic to redirect based on the sessionStorage
export default function NotFoundHandler({ baseRoute, intendedUrl }) {
  useEffect(() => {
    const intendedRoute = new URLSearchParams(window.location.search).get('next')
    if (intendedRoute) {
      window.sessionStorage.setItem('intendedRoute', intendedRoute)
    }
  }, [])

  return (
    <Navigate to={`${baseRoute}?next=${encodeURIComponent(intendedUrl)}`} replace />
  )
}

NotFoundHandler.propTypes = {
  intendedUrl: PropTypes.string.isRequired,
  baseRoute: PropTypes.string.isRequired
}
