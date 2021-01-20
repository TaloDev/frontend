import { useState } from 'react'
import Button from './Button'
import TextInput from './TextInput'

const ConfirmEmailBanner = () => {
  const [code, setCode] = useState('')

  return (
    <div className='bg-indigo-600 p-4 md:p-8 rounded-md mb-4 md:mb-8 w-full md:2/3 lg:w-1/2 flex flex-col space-y-4' role='alert'>
      <p className='text-xl font-bold'>Please confirm your email address</p>

      <p>We've sent a 6 digit code to your email address, please enter it below</p>

      <form className='flex flex-col md:flex-row md:items-end'>
        <div className='w-full md:w-3/4'>
          <TextInput onChange={setCode} value={code} placeholder={'Verification code'} />
        </div>
        <div className='w-full mt-4 md:mt-0 md:w-1/4 md:ml-4'>
          <Button onClick={() => setEnteringCode(true)}>Confirm</Button>
        </div>
      </form>
    </div>
  )
}

export default ConfirmEmailBanner
