import React, { useEffect, useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { useRecoilState } from 'recoil'
import userState from '../state/userState'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import AuthService from '../services/AuthService'
import { useHistory, useLocation } from 'react-router-dom'
import Title from '../components/Title'
import verify2FA from '../api/verify2FA'
import Link from '../components/Link'

const Verify2FA = () => {
  const history = useHistory()
  const location = useLocation()

  const [userId] = useState(location.state?.userId)
  const [code, setCode] = useState('')
  const [, setUser] = useRecoilState(userState)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) history.replace(routes.login)
  }, [userId])

  useEffect(() => {
    if (error?.sessionExpired) {
      history.replace(routes.login, { new2FASessionRequired: true })
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
      <form className={`text-white rounded-md space-y-8 ${unauthedContainerStyle}`}>
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

        <ErrorMessage error={error} />

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
            to={{
              pathname: routes.recover,
              state: { userId }
            }}>
              use a recovery code
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Verify2FA
