import { MouseEvent, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import confirmEnable2FA from '../api/confirmEnable2FA'
import enable2FA from '../api/enable2FA'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import RecoveryCodes from '../components/RecoveryCodes'
import routes from '../constants/routes'
import { ConfirmPasswordAction } from '../pages/ConfirmPassword'
import userState, { AuthedUserState } from '../state/userState'
import buildError from '../utils/buildError'
import Button from './Button'
import TextInput from './TextInput'

export default function Account2FA() {
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useRecoilState(userState) as AuthedUserState

  const [qrCode, setQRCode] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [is2FALoading, set2FALoading] = useState(false)
  const [enable2FAError, setEnable2FAError] = useState<TaloError | null>(null)
  const [justEnabled2FA, setJustEnabled2FA] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | undefined>(
    location.state?.recoveryCodes,
  )

  const onEnable2FAClick = async () => {
    set2FALoading(true)
    setEnable2FAError(null)

    try {
      const { qr } = await enable2FA()
      setQRCode(qr)
    } catch (err) {
      setEnable2FAError(buildError(err))
    } finally {
      set2FALoading(false)
    }
  }

  const onConfirm2FAClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    set2FALoading(true)
    setEnable2FAError(null)

    try {
      const { user, recoveryCodes } = await confirmEnable2FA(code)
      setUser(user)
      setRecoveryCodes(recoveryCodes)
      setJustEnabled2FA(true)
    } catch (err) {
      setEnable2FAError(buildError(err))
    } finally {
      set2FALoading(false)
    }
  }

  const onDisable2FAClick = () => {
    navigate(routes.confirmPassword, {
      state: {
        onConfirmAction: ConfirmPasswordAction.DISABLE_2FA,
      },
    })
  }

  const onViewRecoveryCodesClick = () => {
    navigate(routes.confirmPassword, {
      state: {
        onConfirmAction: ConfirmPasswordAction.VIEW_RECOVERY_CODES,
      },
    })
  }

  const onCreateRecoveryCodesClick = () => {
    navigate(routes.confirmPassword, {
      state: {
        onConfirmAction: ConfirmPasswordAction.CREATE_RECOVERY_CODES,
      },
    })
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-bold lg:text-2xl'>Two factor authentication</h2>
      {!qrCode && !recoveryCodes && (
        <p>
          Add an extra layer of security to your account using any major authenticator app like
          Authy, 1Password or Google Authenticator.
        </p>
      )}

      {!user.has2fa && (
        <>
          {enable2FAError && <ErrorMessage error={enable2FAError} />}

          {qrCode && (
            <form className='space-y-4'>
              <img
                src={qrCode}
                className='mx-auto w-1/2 rounded-lg md:mx-0 md:w-1/3'
                alt='Authenticator QR Code'
              />

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
                className='w-full min-w-30 md:w-auto'
                isLoading={is2FALoading}
                disabled={code.length < 6}
              >
                Confirm
              </Button>
            </form>
          )}

          {!qrCode && (
            <Button
              onClick={onEnable2FAClick}
              className='w-full min-w-30 md:w-auto'
              isLoading={is2FALoading}
            >
              Enable 2FA
            </Button>
          )}
        </>
      )}

      {user.has2fa && recoveryCodes && (
        <div className='space-y-4'>
          {justEnabled2FA && (
            <p data-testid='2fa-success'>
              Two factor authentication has been successfully <strong>enabled</strong>.
            </p>
          )}

          <RecoveryCodes codes={recoveryCodes} showCreateButton={!justEnabled2FA} />
        </div>
      )}

      {user.has2fa && !recoveryCodes && (
        <>
          <p>
            This is currently <strong>enabled</strong>.
          </p>

          <div className='space-y-4 md:flex md:space-y-0 md:space-x-4'>
            <Button className='md:w-auto' onClick={onViewRecoveryCodesClick}>
              View recovery codes
            </Button>

            <Button className='md:w-auto' onClick={onCreateRecoveryCodesClick}>
              Create new recovery codes
            </Button>
          </div>

          <Button
            onClick={onDisable2FAClick}
            variant='red'
            className='w-full min-w-30 md:w-auto'
            isLoading={is2FALoading}
          >
            Disable 2FA
          </Button>
        </>
      )}
    </div>
  )
}
