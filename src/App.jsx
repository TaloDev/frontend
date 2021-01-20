import { useState, useEffect } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { useRecoilState } from 'recoil'
import refreshAccess from './api/refreshAccess'
import accessState from './atoms/accessState'
import attachTokenInterceptor from './utils/attachTokenInterceptor'
import userState from './atoms/userState'
import getMe from './api/getMe'
import Loading from './components/Loading'
import SideNav from './components/SideNav'
import routes from './constants/routes'
import Events from './pages/Events'
import Players from './pages/Players'
import Register from './pages/Register'

const App = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessState)
  const [user, setUser] = useRecoilState(userState)
  const [isRefreshing, setRefreshing] = useState(true)

  const handleRefreshSession = async () => {
    try {
      let res = await refreshAccess()
      const accessToken = res.data.accessToken
      res = await getMe(accessToken)
      setUser(res.data.user)
      setAccessToken(accessToken)
    } catch (err) {
      console.log('User doesn\'t have a session')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (accessToken === null) handleRefreshSession()
  }, [])

  useEffect(() => {
    if (accessToken) attachTokenInterceptor(accessToken, setAccessToken)
  }, [accessToken])

  useEffect(() => {
    if (!user && accessToken) setAccessToken(null)
    if (!accessToken && user) setUser(null)
  }, [user, accessToken])

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
        <>
          <SideNav />
          <main className='bg-gray-800 w-3/4 md:w-5/6 p-2 md:p-8 text-white'>
            <Switch>
              <Route exact path='/' component={Dashboard} />
              <Route exact path={routes.players} component={Players} />
              <Route exact path={routes.events} component={Events} />
              <Redirect to='/' />
            </Switch>
          </main>
        </>
      }
    </BrowserRouter>
  )
}

export default App
