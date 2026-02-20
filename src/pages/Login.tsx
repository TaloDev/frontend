import type { MouseEvent } from 'react'
import * as Sentry from '@sentry/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import login from '../api/login'
import taloIcon from '../assets/talo-icon.svg'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Link from '../components/Link'
import TaloInfoCard from '../components/TaloInfoCard'
import TextInput from '../components/TextInput'
import routes from '../constants/routes'
import AuthService from '../services/AuthService'
import userState from '../state/userState'
import { unauthedContainerStyle } from '../styles/theme'
import buildError from '../utils/buildError'

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
          state: { userId: res.userId },
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
    <div className='flex h-full flex-col p-8 md:items-center md:justify-center'>
      <form className={clsx('space-y-8 text-white', unauthedContainerStyle)}>
        <div className='space-y-4'>
          <h1 className='flex items-center space-x-4 font-mono text-4xl font-bold'>
            <img src={taloIcon} alt='Talo' className='h-[32px] w-[32px]' />
            <span>Talo Game Services</span>
          </h1>

          <TaloInfoCard />

          {wasLoggedOut && <AlertBanner text='You were logged out' />}

          {location.state?.new2FASessionRequired && (
            <AlertBanner text='Your 2FA session has expired, please log in again' />
          )}
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

          <Link to={routes.forgotPassword} className='mt-4 inline-block'>
            Forgot your password?
          </Link>
        </div>

        {error && <ErrorMessage error={error} />}

        <Button disabled={!email || !password} onClick={onLoginClick} isLoading={isLoading}>
          Login
        </Button>
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>
          Need an account? <Link to={routes.register}>Register here</Link>
        </p>
      </div>
    </div>
  )
}
