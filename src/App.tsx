import * as Sentry from '@sentry/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import refreshAccess from './api/refreshAccess'
import Loading from './components/Loading'
import Router from './Router'
import AuthService from './services/AuthService'
import { activeGameState } from './state/activeGameState'
import { gamesState } from './state/gamesState'
import { userState } from './state/userState'

function AppLoading() {
  return (
    <main className='flex w-full items-center justify-center'>
      <Loading />
    </main>
  )
}

export default function App() {
  const setUser = useSetAtom(userState)

  const [hasTriedRefreshing, setTriedRefreshing] = useState(false)
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null)

  const games = useAtomValue(gamesState)
  const [activeGame, setActiveGame] = useAtom(activeGameState)
  const refreshingRef = useRef(false)

  const handleRefreshSession = useCallback(async () => {
    if (refreshingRef.current) return
    refreshingRef.current = true

    try {
      const { accessToken, user } = await refreshAccess()
      AuthService.setToken(accessToken)
      setUser(user)

      Sentry.setUser({ id: user.id, username: user.username })
    } catch {
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
      void handleRefreshSession()
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
