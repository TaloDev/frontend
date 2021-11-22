import React, { useEffect, useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Link from '../components/Link'
import { useRecoilState } from 'recoil'
import userState from '../state/userState'
import ErrorMessage from '../components/ErrorMessage'
import login from '../api/login'
import buildError from '../utils/buildError'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import AuthService from '../services/AuthService'
import AlertBanner from '../components/AlertBanner'
import { useHistory } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setUser] = useRecoilState(userState)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [wasLoggedOut] = useState(window.localStorage.getItem('loggedOut'))

  const history = useHistory()

  useEffect(() => {
    const intendedRoute = new URLSearchParams(window.location.search).get('next')

    if (intendedRoute) {
      window.localStorage.setItem('intendedRoute', intendedRoute)
      history.replace(window.location.pathname)
    } else {
      window.localStorage.removeItem('intendedRoute')
    }
  }, [])

  useEffect(() => {
    if (wasLoggedOut) {
      setTimeout(() => {
        window.localStorage.removeItem('loggedOut')
      }, 500)
    }
  }, [wasLoggedOut])

  const onLoginClick = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await login({ email, password })
      const accessToken = res.data.accessToken
      AuthService.setToken(accessToken)
      setUser(res.data.user)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={`text-white rounded-md space-y-8 ${unauthedContainerStyle}`}>
        <div>
          <h1 className='text-4xl font-bold'>Welcome back</h1>
          {wasLoggedOut &&
            <AlertBanner className='mt-4' text='You were logged out' />
          }
        </div>

        <TextInput
          id='email'
          label='Email'
          type='email'
          placeholder='Email'
          onChange={setEmail}
          value={email}
        />

        <TextInput
          id='password'
          label='Password'
          placeholder='Password'
          type='password'
          onChange={setPassword}
          value={password}
        />

        <ErrorMessage error={error}>
          {error?.showHint &&
            <span>. Have you <Link to={routes.forgotPass}>forgotten your password?</Link></span>
          }
        </ErrorMessage>

        <Button
          disabled={!email || !password}
          onClick={onLoginClick}
          isLoading={isLoading}
        >
          Login
        </Button>
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>Need an account? <Link to='/register'>Register here</Link></p>
      </div>
    </div>
  )
}

export default Login
