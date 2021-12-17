import React, { useState } from 'react'
import confirmEnable2FA from '../api/confirmEnable2FA'
import enable2FA from '../api/enable2FA'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import { useRecoilState } from 'recoil'
import userState from '../state/userState'
import RecoveryCodes from '../components/RecoveryCodes'
import routes from '../constants/routes'
import { ConfirmPasswordAction } from '../pages/ConfirmPassword'
import Button from './Button'
import TextInput from './TextInput'
import { useHistory, useLocation } from 'react-router-dom'

function Account2FA() {
  const history = useHistory()
  const location = useLocation()

  const [user, setUser] = useRecoilState(userState)

  const [qrCode, setQRCode] = useState(null)
  const [code, setCode] = useState('')
  const [is2FALoading, set2FALoading] = useState(false)
  const [enable2FAError, setEnable2FAError] = useState(null)
  const [justEnabled2FA, setJustEnabled2FA] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState(location.state?.recoveryCodes)

  const onEnable2FAClick = async () => {
    set2FALoading(true)
    setEnable2FAError(null)

    try {
      const res = await enable2FA()
      setQRCode(res.data.qr)
    } catch (err) {
      setEnable2FAError(buildError(err))
    } finally {
      set2FALoading(false)
    }
  }

  const onConfirm2FAClick = async (e) => {
    e.preventDefault()

    set2FALoading(true)
    setEnable2FAError(null)

    try {
      const res = await confirmEnable2FA(code)
      setUser(res.data.user)
      setRecoveryCodes(res.data.recoveryCodes)
      setJustEnabled2FA(true)
    } catch (err) {
      setEnable2FAError(buildError(err))
    } finally {
      set2FALoading(false)
    }
  }

  const onDisable2FAClick = () => {
    history.push(routes.confirmPassword, {
      onConfirmAction: ConfirmPasswordAction.DISABLE_2FA
    })
  }

  const onViewRecoveryCodesClick = () => {
    history.push(routes.confirmPassword, {
      onConfirmAction: ConfirmPasswordAction.VIEW_RECOVERY_CODES
    })
  }

  const onCreateRecoveryCodesClick = () => {
    history.push(routes.confirmPassword, {
      onConfirmAction: ConfirmPasswordAction.CREATE_RECOVERY_CODES
    })
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl lg:text-2xl font-bold'>Two factor authentication</h2>
      {!qrCode && !recoveryCodes &&
        <p>Add an extra layer of security to your account using any major authenticator app like Authy, 1Password or Google Authenticator.</p>
      }

      {!user.has2fa &&
        <>
          <ErrorMessage error={enable2FAError} />

          {qrCode &&
            <form className='space-y-4'>
              <img src={qrCode} className='w-1/2 md:w-1/3 mx-auto md:mx-0 rounded-lg' alt='Authenticator QR Code' />

              <p>Scan the code above in your authenticator app. Enter the code you get below:</p>

              <div className='w-full md:w-2/3 lg:w-1/2'>
                <TextInput
                  id='code'
                  onChange={setCode}
                  value={code}
                  placeholder='Enter your code'
                  variant='light'
                  label='Code'
                />
              </div>

              <Button
                onClick={onConfirm2FAClick}
                className='w-full md:w-auto min-w-30'
                isLoading={is2FALoading}
                disabled={code.length < 6}
              >
                Confirm
              </Button>
            </form>
          }

          {!qrCode &&
            <Button
              onClick={onEnable2FAClick}
              className='w-full md:w-auto min-w-30'
              isLoading={is2FALoading}
            >
              Enable 2FA
            </Button>
          }
        </>
      }

      {user.has2fa && recoveryCodes &&
        <div className='space-y-4'>
          {justEnabled2FA && <p data-testid='2fa-success'>Two factor authentication has been successfully <strong>enabled</strong>.</p>}

          <RecoveryCodes
            codes={recoveryCodes}
            showCreateButton={!justEnabled2FA}
          />
        </div>
      }

      {user.has2fa && !recoveryCodes &&
        <>
          <p>This is currently <strong>enabled</strong>.</p>

          <div className='space-y-4 md:space-y-0 md:flex md:space-x-4'>
            <Button
              className='md:w-auto'
              onClick={onViewRecoveryCodesClick}
            >
              View recovery codes
            </Button>

            <Button
              className='md:w-auto'
              onClick={onCreateRecoveryCodesClick}
            >
              Create new recovery codes
            </Button>
          </div>

          <Button
            onClick={onDisable2FAClick}
            variant='red'
            className='w-full md:w-auto min-w-30'
            isLoading={is2FALoading}
          >
            Disable 2FA
          </Button>
        </>
      }
    </div>
  )
}

export default Account2FA
