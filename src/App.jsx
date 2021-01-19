import { useEffect } from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { useRecoilState } from 'recoil'
import refreshAccess from './api/refreshAccess'
import accessState from './atoms/accessState'
import attachTokenInterceptor from './utils/attachTokenInterceptor'

const App = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessState)

  const handleRefreshSession = async () => {
    try {
      const res = await refreshAccess()
      setAccessToken(res.data.accessToken)
    } catch (err) {
      console.log('User doesn\'t have a session')
    }
  }

  useEffect(() => {
    if (accessToken === null) handleRefreshSession()
  }, [])

  useEffect(() => {
    if (accessToken) attachTokenInterceptor(accessToken, setAccessToken)
  }, [accessToken])

  return (
    <BrowserRouter>
      {!accessToken &&
        <>
          <Route exact path='/'>
            <Login />
          </Route>
        </>
      }

      {accessToken &&
        <>
          <Route exact path='/'>
            <Dashboard />
          </Route>
         </>
      }

      <Redirect to='/' />
    </BrowserRouter>
  )
}

export default App
