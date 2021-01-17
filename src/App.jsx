import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import Login from './pages/Login'

const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Route exact path='/'>
          <Login />
        </Route>

        <Redirect to='/' />
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
