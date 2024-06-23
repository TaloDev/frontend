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
import recoverAccount from '../api/recoverAccount'
import RecoveryCodes from '../components/RecoveryCodes'
import userState from '../state/userState'
import { User } from '../entities/user'

export default function RecoverAccount() {
  const navigate = useNavigate()
  const location = useLocation()

  const [userId] = useState(location.state?.userId)
  const [code, setCode] = useState('')
  const setUser = useSetRecoilState(userState)
  const [error, setError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null)

  const [authData, setAuthData] = useState<{ accessToken: string, user: User } | null>(null)

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
      const { accessToken, user, newRecoveryCodes } = await recoverAccount(code, userId)

      if (!newRecoveryCodes) {
        AuthService.setToken(accessToken)
        setUser(user)
      } else {
        setRecoveryCodes(newRecoveryCodes)
        setAuthData({ accessToken, user })
      }
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  const onContinueClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    AuthService.setToken(authData!.accessToken)
    setUser(authData!.user)
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={`text-white space-y-8 ${unauthedContainerStyle}`}>
        {!recoveryCodes &&
          <>
            <Title>Recover account</Title>

            <TextInput
              label='Code'
              type='text'
              id='recovery-code'
              placeholder='10-digit recovery code'
              onChange={setCode}
              value={code}
            />

            {error && <ErrorMessage error={error} />}

            <Button
              disabled={code.length < 10}
              onClick={onConfirmClick}
              isLoading={isLoading}
            >
              Confirm
            </Button>
          </>
        }

        {recoveryCodes &&
          <>
            <Title>New recovery codes</Title>
            <p>You used your last recovery code so we&apos;ve created 8 new codes.</p>

            <RecoveryCodes withBackground codes={recoveryCodes} />

            <Button
              onClick={onContinueClick}
            >
              Continue
            </Button>
          </>
        }
      </form>
    </div>
  )
}
