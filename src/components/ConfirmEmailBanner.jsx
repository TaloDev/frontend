import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import confirmEmail from '../api/confirmEmail'
import userState from '../atoms/userState'
import buildError from '../utils/buildError'
import Button from './Button'
import ErrorMessage from './ErrorMessage'
import TextInput from './TextInput'

const ConfirmEmailBanner = () => {
  const [code, setCode] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [, setUser] = useRecoilState(userState)

  const onConfirmClick = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    try {
      const res = await confirmEmail(code)
      setUser(res.data.user)
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-gray-900 p-4 md:p-8 rounded-md mb-4 md:mb-8 w-full md:2/3 lg:w-1/2 flex flex-col space-y-4' role='alert'>
      <p className='text-xl font-bold'>Please confirm your email address</p>

      <p>We've sent a 6 digit code to your email address, please enter it below</p>

      <ErrorMessage error={error} />

      <form className='flex flex-col md:flex-row md:items-center'>
        <div className='w-full md:w-1/3'>
          <TextInput
            id='code'
            onChange={setCode}
            value={code}
            placeholder={'Code'}
            variant='light'
          />
        </div>
        <div className='w-full mt-4 md:mt-0 md:w-24 md:ml-4'>
          <Button
            disabled={code.length < 6 || isLoading}
            onClick={onConfirmClick}
            isLoading={isLoading}
          >
            Confirm
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ConfirmEmailBanner
