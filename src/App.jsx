import React, { useState, useEffect } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { useRecoilState, useRecoilValue } from 'recoil'
import refreshAccess from './api/refreshAccess'
import accessState from './state/accessState'
import attachTokenInterceptor from './utils/attachTokenInterceptor'
import userState from './state/userState'
import getMe from './api/getMe'
import Loading from './components/Loading'
import NavBar from './components/NavBar'
import routes from './constants/routes'
import Events from './pages/Events'
import Players from './pages/Players'
import Register from './pages/Register'
import ConfirmEmailBanner from './components/ConfirmEmailBanner'
import gamesState from './state/gamesState'
import activeGameState from './state/activeGameState'
import APIKeys from './pages/APIKeys'

const App = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessState)
  const [user, setUser] = useRecoilState(userState)
  const [isRefreshing, setRefreshing] = useState(true)
  const games = useRecoilValue(gamesState)
  const [activeGame, setActiveGame] = useRecoilState(activeGameState)

  const handleRefreshSession = async () => {
    try {
      let res = await refreshAccess()
      const accessToken = res.data.accessToken
      res = await getMe(accessToken)
      setUser(res.data.user)
      setAccessToken(accessToken)
      attachTokenInterceptor(accessToken, setAccessToken)
    } catch (err) {
      console.log('User doesn\'t have a session')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (!accessToken) handleRefreshSession()
  }, [])

  useEffect(() => {
    if (!activeGame && games.length > 0) setActiveGame(games[0])
  }, [activeGame, games])

  if (isRefreshing) {
    return (
      <main className='w-full flex items-center justify-center'>
        <Loading />
      </main>
    )
  }

  return (
    <BrowserRouter>
      {!accessToken &&
        <main className='bg-gray-800 w-full'>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path={routes.register} component={Register} />
            <Redirect to='/' />
          </Switch>
        </main>
      }

      {accessToken &&
        <div className='w-full'>
          <NavBar />
          <main className='bg-gray-800 w-full p-4 md:p-8 text-white'>
            {!user.emailConfirmed && <ConfirmEmailBanner />}

            <Switch>
              <Route exact path='/' component={Dashboard} />
              <Route exact path={routes.players} component={Players} />
              <Route exact path={routes.events} component={Events} />
              <Route exact path={routes.apiKeys} component={APIKeys} />
              <Redirect to='/' />
            </Switch>
          </main>
        </div>
      }
    </BrowserRouter>
  )
}

export default App
