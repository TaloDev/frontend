import { useEffect, useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { useSetRecoilState } from 'recoil'
import userState from '../state/userState'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import AuthService from '../services/AuthService'
import { useNavigate, useLocation } from 'react-router-dom'
import Title from '../components/Title'
import verify2FA from '../api/verify2FA'
import Link from '../components/Link'

export default function Verify2FA() {
  const navigate = useNavigate()
  const location = useLocation()

  const [userId] = useState(location.state?.userId)
  const [code, setCode] = useState('')
  const setUser = useSetRecoilState(userState)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) navigate(routes.login, { replace: true })
  }, [userId])

  useEffect(() => {
    if (error?.sessionExpired) {
      navigate(routes.login, {
        replace: true,
        state: {
          new2FASessionRequired: true
        }
      })
    }
  }, [error])

  const onConfirmClick = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await verify2FA(code, userId)
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
      <form className={`text-white space-y-8 ${unauthedContainerStyle}`}>
        <Title>Two factor authentication</Title>

        <TextInput
          label='Code'
          type='text'
          name='token'
          id='token'
          inputmode='numeric'
          pattern='[0-9]*'
          autocomplete='one-time-code'
          placeholder='One-time code'
          onChange={setCode}
          value={code}
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
