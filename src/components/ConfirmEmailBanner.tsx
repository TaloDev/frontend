import { MouseEvent, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import confirmEmail from '../api/confirmEmail'
import userState, { AuthedUserState } from '../state/userState'
import buildError from '../utils/buildError'
import Button from './Button'
import ErrorMessage, { TaloError } from './ErrorMessage'
import TextInput from './TextInput'
import justConfirmedEmailState from '../state/justConfirmedEmailState'

export default function ConfirmEmailBanner() {
  const [code, setCode] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const [user, setUser] = useRecoilState(userState) as AuthedUserState
  const [justConfirmedEmail, setJustConfirmedEmail] = useRecoilState(justConfirmedEmailState)

  const location = useLocation()

  useEffect(() => {
    setJustConfirmedEmail(false)
  }, [location, setJustConfirmedEmail])

  const onConfirmClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    setLoading(true)
    try {
      const { user } = await confirmEmail(code)
      setUser(user)
      setJustConfirmedEmail(true)
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-gray-900 p-4 md:p-8 rounded-md w-full lg:2/3 xl:w-1/2 space-y-4' role='alert'>
      {!user.emailConfirmed &&
        <>
          <div>
            <p className='text-xl font-bold'>Please confirm your email address</p>
            <p>We&apos;ve sent a 6 digit code to your email address, please enter it below:</p>
          </div>

          <form className='flex flex-col lg:flex-row lg:items-center'>
            <div className='w-full lg:w-1/3'>
              <TextInput
                id='code'
                onChange={setCode}
                value={code}
                placeholder='Code'
                variant='light'
              />
            </div>
            <div className='w-full mt-4 lg:mt-0 lg:w-24 lg:ml-4'>
              <Button
                disabled={code.length < 6}
                onClick={onConfirmClick}
                isLoading={isLoading}
              >
                Confirm
              </Button>
            </div>
          </form>

          {error && <ErrorMessage error={error} />}
        </>
      }

      {justConfirmedEmail &&
        <div>
          <p className='text-xl font-bold'>Success!</p>
          <p>We&apos;ve confirmed your email and unlocked the rest of the dashboard for you</p>
        </div>
      }
    </div>
  )
}
