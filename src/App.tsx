import { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import * as Sentry from '@sentry/react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import refreshAccess from './api/refreshAccess'
import Loading from './components/Loading'
import gamesState from './state/gamesState'
import AuthService from './services/AuthService'
import Router from './Router'
import userState from './state/userState'
import activeGameState from './state/activeGameState'

function AppLoading() {
  return (
    <main className='w-full flex items-center justify-center'>
      <Loading />
    </main>
  )
}

export default function App() {
  const setUser = useSetRecoilState(userState)

  const [hasTriedRefreshing, setTriedRefreshing] = useState(false)
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null)

  const games = useRecoilValue(gamesState)
  const [activeGame, setActiveGame] = useRecoilState(activeGameState)
  const refreshingRef = useRef(false)

  const handleRefreshSession = useCallback(async () => {
    try {
      if (refreshingRef.current) return
      refreshingRef.current = true

      const { accessToken, user } = await refreshAccess()
      AuthService.setToken(accessToken)
      setUser(user)

      Sentry.setUser({ id: user.id, username: user.username })
    } catch (err) {
      setActiveGame(null)
    } finally {
      setTriedRefreshing(true)
    }
  }, [setUser, setActiveGame])

  useEffect(() => {
    const location = window.location.pathname + window.location.search
    if (location !== '/') {
      setIntendedRoute(location)
    }
  }, [])

  useEffect(() => {
    if (!hasTriedRefreshing) {
      handleRefreshSession()
    }
  }, [intendedRoute, hasTriedRefreshing, handleRefreshSession])

  useEffect(() => {
    if (!activeGame && games.length > 0) setActiveGame(games[0])
  }, [activeGame, games, setActiveGame])

  if (!hasTriedRefreshing) return <AppLoading />

  return (
    <Suspense fallback={<AppLoading />}>
      <Router intendedRoute={intendedRoute} />
    </Suspense>
  )
}
