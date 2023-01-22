import { useEffect, useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Link from '../components/Link'
import { useSetRecoilState } from 'recoil'
import userState from '../state/userState'
import ErrorMessage from '../components/ErrorMessage'
import login from '../api/login'
import buildError from '../utils/buildError'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import AuthService from '../services/AuthService'
import AlertBanner from '../components/AlertBanner'
import { useNavigate, useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setUser = useSetRecoilState(userState)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [wasLoggedOut] = useState(window.localStorage.getItem('loggedOut'))

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const intendedRoute = new URLSearchParams(window.location.search).get('next')

    if (intendedRoute) {
      window.localStorage.setItem('intendedRoute', intendedRoute)
      navigate(window.location.pathname, { replace: true })
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

      if (res.data.twoFactorAuthRequired) {
        navigate(routes.verify2FA, {
          state: { userId: res.data.userId }
        })
      } else {
        const accessToken = res.data.accessToken
        AuthService.setToken(accessToken)
        setUser(res.data.user)

        Sentry.setUser({ id: res.data.user.id, username: res.data.user.username })
      }
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={`text-white space-y-8 ${unauthedContainerStyle}`}>
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold'>Welcome back</h1>

          {wasLoggedOut &&
            <AlertBanner text='You were logged out' />
          }

          {location.state?.new2FASessionRequired &&
            <AlertBanner text='Your 2FA session has expired, please log in again' />
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

        <div>
          <TextInput
            id='password'
            label='Password'
            placeholder='Password'
            type='password'
            onChange={setPassword}
            value={password}
          />

          <Link to={routes.forgotPassword} className='block mt-4'>Forgot your password?</Link>
        </div>

        {error && <ErrorMessage error={error} />}

        <Button
          disabled={!email || !password}
          onClick={onLoginClick}
          isLoading={isLoading}
        >
          Login
        </Button>
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>Need an account? <Link to={routes.register}>Register here</Link></p>
      </div>
    </div>
  )
}

export default Login
