import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import confirmEmail from '../api/confirmEmail'
import userState from '../state/userState'
import buildError from '../utils/buildError'
import Button from './Button'
import ErrorMessage from './ErrorMessage'
import TextInput from './TextInput'

const ConfirmEmailBanner = () => {
  const [code, setCode] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [user, setUser] = useRecoilState(userState)

  const onConfirmClick = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    try {
      const res = await confirmEmail(code)
      setUser({
        ...res.data.user,
        justConfirmedEmail: true
      })
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-gray-900 p-4 md:p-8 rounded-md mb-8 lg:mb-12 w-full lg:2/3 xl:w-1/2 space-y-4' role='alert'>
      {!user.emailConfirmed &&
        <>
          <div>
            <p className='text-xl font-bold'>Please confirm your email address</p>
            <p>We&apos;ve sent a 6 digit code to your email address, please enter it below:</p>
          </div>

          <ErrorMessage error={error} />

          <form className='flex flex-col lg:flex-row lg:items-center'>
            <div className='w-full lg:w-1/3'>
              <TextInput
                id='code'
                onChange={setCode}
                value={code}
                placeholder={'Code'}
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
        </>
      }

      {user.justConfirmedEmail &&
        <div>
          <p className='text-xl font-bold'>Success!</p>
          <p>We&apos;ve confirmed your email and unlocked the rest of the dashboard for you</p>
        </div>
      }
    </div>
  )
}

export default ConfirmEmailBanner
