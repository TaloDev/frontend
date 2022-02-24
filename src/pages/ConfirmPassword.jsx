import React, { useEffect, useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import { unauthedContainerStyle } from '../styles/theme'
import { useHistory, useLocation } from 'react-router-dom'
import Title from '../components/Title'
import buildError from '../utils/buildError'
import disable2fa from '../api/disable2fa'
import userState from '../state/userState'
import { useRecoilState } from 'recoil'
import routes from '../constants/routes'
import changePassword from '../api/changePassword'
import viewRecoveryCodes from '../api/viewRecoveryCodes'
import createRecoveryCodes from '../api/createRecoveryCodes'

export const ConfirmPasswordAction = {
  DISABLE_2FA: 'disable2FA',
  CHANGE_PASSWORD: 'changePassword',
  VIEW_RECOVERY_CODES: 'viewRecoveryCodes',
  CREATE_RECOVERY_CODES: 'createRecoveryCodes'
}

const ConfirmPassword = () => {
  const location = useLocation()
  const history = useHistory()

  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const [, setUser] = useRecoilState(userState)

  useEffect(() => {
    if (!location.state?.onConfirmAction) {
      history.goBack()
    }
  }, [location, history])

  const ActionMap = {
    [ConfirmPasswordAction.DISABLE_2FA]: async () => {
      const res = await disable2fa(password)
      setUser(res.data.user)
      history.replace(routes.account, { successMessage: 'Two factor authentication has been disabled' })
    },
    [ConfirmPasswordAction.CHANGE_PASSWORD]: async () => {
      await changePassword(password, location.state.newPassword)
      history.replace(routes.account, { successMessage: 'Your password has been updated' })
    },
    [ConfirmPasswordAction.VIEW_RECOVERY_CODES]: async () => {
      const res = await viewRecoveryCodes(password)
      history.replace(routes.account, { recoveryCodes: res.data.recoveryCodes })
    },
    [ConfirmPasswordAction.CREATE_RECOVERY_CODES]: async () => {
      const res = await createRecoveryCodes(password)
      history.replace(routes.account, {
        successMessage: 'Your new recovery codes have been generated',
        recoveryCodes: res.data.recoveryCodes
      })
    }
  }

  const onConfirmClick = async (e) => {
    setLoading(true)
    setError(null)

    try {
      await ActionMap[location.state.onConfirmAction]()
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <div className='md:translate-y-[80%]'>
      <form className={`mx-auto text-white rounded-md space-y-8 ${unauthedContainerStyle}`}>
        <Title>Confirm your password</Title>

        <TextInput
          id='password'
          label='Password'
          placeholder='Your current password'
          type='password'
          onChange={setPassword}
          value={password}
        />

        {error && <ErrorMessage error={error} />}

        <Button
          disabled={!password}
          onClick={onConfirmClick}
          isLoading={isLoading}
        >
          Confirm
        </Button>
      </form>
    </div>
  )
}

export default ConfirmPassword
