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
import recoverAccount from '../api/recoverAccount'
import RecoveryCodes from '../components/RecoveryCodes'

const RecoverAccount = () => {
  const history = useHistory()
  const location = useLocation()

  const [userId] = useState(location.state?.userId)
  const [code, setCode] = useState('')
  const [, setUser] = useRecoilState(userState)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState(null)

  const [authData, setAuthData] = useState({})

  useEffect(() => {
    if (!userId) history.replace(routes.login)
  }, [userId])

  const onConfirmClick = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await recoverAccount(code, userId)

      if (!res.data.newRecoveryCodes) {
        const accessToken = res.data.accessToken
        AuthService.setToken(accessToken)
        setUser(res.data.user)
      } else {
        setRecoveryCodes(res.data.newRecoveryCodes)
        setAuthData(res.data)
      }
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  const onContinueClick = (e) => {
    e.preventDefault()

    AuthService.setToken(authData.accessToken)
    setUser(authData.user)
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={`text-white rounded-md space-y-8 ${unauthedContainerStyle}`}>
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

            <ErrorMessage error={error} />

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

export default RecoverAccount
