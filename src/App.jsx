import React, { useState, useEffect, Suspense } from 'react'
import { useHistory } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import refreshAccess from './api/refreshAccess'
import userState from './state/userState'
import Loading from './components/Loading'
import gamesState from './state/gamesState'
import activeGameState from './state/activeGameState'
import AuthService from './services/AuthService'
import Router from './Router'

const App = () => {
  const setUser = useSetRecoilState(userState)

  const [isRefreshing, setRefreshing] = useState(true)
  const [hasTriedRefreshing, setTriedRefreshing] = useState(false)
  const [intendedUrl, setIntendedUrl] = useState(null)

  const games = useRecoilValue(gamesState)
  const [activeGame, setActiveGame] = useRecoilState(activeGameState)

  const history = useHistory()

  const handleRefreshSession = async () => {
    try {
      const res = await refreshAccess()
      const accessToken = res.data.accessToken
      AuthService.setToken(accessToken)
      setUser(res.data.user)

      Sentry.setUser({ id: res.data.user.id, username: res.data.user.username })
    } catch (err) {
      console.log('User doesn\'t have a session')
      setActiveGame(null)
    } finally {
      setRefreshing(false)
      setTriedRefreshing(true)
    }
  }

  useEffect(() => {
    setIntendedUrl(window.location.pathname)
  }, [])

  useEffect(() => {
    if (!hasTriedRefreshing && intendedUrl) {
      handleRefreshSession()
    } else if (hasTriedRefreshing) {
      history.replace(intendedUrl)
    }
  }, [intendedUrl, hasTriedRefreshing])

  useEffect(() => {
    if (!activeGame && games.length > 0) setActiveGame(games[0])
  }, [activeGame, games])

  const appLoading = (
    <main className='w-full flex items-center justify-center'>
      <Loading />
    </main>
  )

  if (isRefreshing) return appLoading

  return (
    <Suspense fallback={appLoading}>
      <Router intendedUrl={intendedUrl} />
    </Suspense>
  )
}

export default App
