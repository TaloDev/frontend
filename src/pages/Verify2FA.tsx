import { MouseEvent, useEffect, useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { useSetRecoilState } from 'recoil'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import AuthService from '../services/AuthService'
import { useNavigate, useLocation } from 'react-router-dom'
import Title from '../components/Title'
import verify2FA from '../api/verify2FA'
import Link from '../components/Link'
import userState from '../state/userState'
import clsx from 'clsx'

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
          new2FASessionRequired: true
        }
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
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={clsx('text-white space-y-8', unauthedContainerStyle)}>
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
            autoComplete: 'one-time-code'
          }}
        />

        {error && <ErrorMessage error={error} />}

        <Button
          disabled={code.length < 6}
          onClick={onConfirmClick}
          isLoading={isLoading}
        >
          Confirm
        </Button>
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>
          <span>Or, </span>
          <Link
            to={routes.recover}
            state={{ userId }}
          >
            use a recovery code
          </Link>
        </p>
      </div>
    </div>
  )
}
