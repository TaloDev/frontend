import { useState, useEffect, Suspense } from 'react'
import * as Sentry from '@sentry/react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import refreshAccess from './api/refreshAccess'
import userState from './state/userState'
import Loading from './components/Loading'
import gamesState from './state/gamesState'
import activeGameState from './state/activeGameState'
import AuthService from './services/AuthService'
import Router from './Router'

function AppLoading() {
  return (
    <main className='w-full flex items-center justify-center'>
      <Loading />
    </main>
  )
}

function App() {
  const setUser = useSetRecoilState(userState)

  const [hasTriedRefreshing, setTriedRefreshing] = useState(false)
  const [intendedRoute, setIntendedRoute] = useState(null)

  const games = useRecoilValue(gamesState)
  const [activeGame, setActiveGame] = useRecoilState(activeGameState)

  const handleRefreshSession = async () => {
    try {
      const res = await refreshAccess()
      const accessToken = res.data.accessToken
      AuthService.setToken(accessToken)
      setUser(res.data.user)

      Sentry.setUser({ id: res.data.user.id, username: res.data.user.username })
    } catch (err) {
      setActiveGame(null)
    } finally {
      setTriedRefreshing(true)
    }
  }

  useEffect(() => {
    const location = window.location.pathname + window.location.search
    if (location !== '/') {
      setIntendedRoute(location)
    } else {
      setTriedRefreshing(true)
    }
  }, [])

  useEffect(() => {
    if (!hasTriedRefreshing && intendedRoute) {
      handleRefreshSession()
    }
  }, [intendedRoute, hasTriedRefreshing])

  useEffect(() => {
    if (!activeGame && games.length > 0) setActiveGame(games[0])
  }, [activeGame, games])

  if (!hasTriedRefreshing) return <AppLoading />

  return (
    <Suspense fallback={<AppLoading />}>
      <Router intendedRoute={intendedRoute} />
    </Suspense>
  )
}

export default App
