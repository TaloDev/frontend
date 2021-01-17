import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import Login from './pages/Login'

const App = () => {
  return (
    <BrowserRouter>
      <Route exact path='/'>
        <Login />
      </Route>

      <Redirect to='/' />
    </BrowserRouter>
  )
}

export default App
