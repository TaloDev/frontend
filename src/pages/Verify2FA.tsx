import clsx from 'clsx'
import { MouseEvent, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import verify2FA from '../api/verify2FA'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Link from '../components/Link'
import TextInput from '../components/TextInput'
import Title from '../components/Title'
import routes from '../constants/routes'
import AuthService from '../services/AuthService'
import userState from '../state/userState'
import { unauthedContainerStyle } from '../styles/theme'
import buildError from '../utils/buildError'

export default function Verify2FA() {
  const navigate = useNavigate()
  const location = useLocation()

  const [userId] = useState(location.state?.userId)
  const [code, setCode] = useState('')
  const setUser = useSetRecoilState(userState)
  const [error, setError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) navigate(routes.login, { replace: true })
  }, [userId, navigate])

  useEffect(() => {
    if (error && 'sessionExpired' in error) {
      navigate(routes.login, {
        replace: true,
        state: {
          new2FASessionRequired: true,
        },
      })
    }
  }, [error, navigate])

  const onConfirmClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { accessToken, user } = await verify2FA(code, userId)
      AuthService.setToken(accessToken)
      setUser(user)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <div className='flex h-full flex-col p-8 md:items-center md:justify-center'>
      <form className={clsx('space-y-8 text-white', unauthedContainerStyle)}>
        <Title>Two factor authentication</Title>

        <TextInput
          label='Code'
          type='text'
          id='token'
          placeholder='One-time code'
          onChange={setCode}
          value={code}
          inputExtra={{
            name: 'token',
            inputMode: 'numeric',
            pattern: '[0-9]*',
            autoComplete: 'one-time-code',
          }}
        />

        {error && <ErrorMessage error={error} />}

        <Button disabled={code.length < 6} onClick={onConfirmClick} isLoading={isLoading}>
          Confirm
        </Button>
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>
          <span>Or, </span>
          <Link to={routes.recover} state={{ userId }}>
            use a recovery code
          </Link>
        </p>
      </div>
    </div>
  )
}
