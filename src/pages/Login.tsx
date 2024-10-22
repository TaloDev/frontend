import { useEffect, useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Link from '../components/Link'
import { useSetRecoilState } from 'recoil'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import login from '../api/login'
import buildError from '../utils/buildError'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import AuthService from '../services/AuthService'
import AlertBanner from '../components/AlertBanner'
import { useNavigate, useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import type { MouseEvent } from 'react'
import userState from '../state/userState'
import taloIcon from '../assets/talo-icon.svg'
import TaloInfoCard from '../components/TaloInfoCard'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setUser = useSetRecoilState(userState)
  const [error, setError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [wasLoggedOut] = useState(window.localStorage.getItem('loggedOut'))

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (wasLoggedOut) {
      setTimeout(() => {
        window.localStorage.removeItem('loggedOut')
      }, 500)
    }
  }, [wasLoggedOut])

  const onLoginClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await login({ email, password })

      if ('twoFactorAuthRequired' in res) {
        navigate(routes.verify2FA, {
          state: { userId: res.userId }
        })
      } else {
        AuthService.setToken(res.accessToken)
        setUser(res.user)

        Sentry.setUser({ id: res.user.id, username: res.user.username })
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
          <h1 className='text-4xl font-mono font-bold flex items-center space-x-4'>
            <img src={taloIcon} alt='Talo' className='w-[32px] h-[32px]' />
            <span>Talo Game Services</span>
          </h1>

          <TaloInfoCard />

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
