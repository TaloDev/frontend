import { useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'

const Login = () => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  return (
    <div className='h-full'>
      <main className='h-full p-8 flex md:items-center justify-center'>
        <div className='text-gray-100 rounded-md w-full md:w-2/3 xl:w-1/3 flex flex-col space-y-12'>
          <h1 className='text-4xl font-bold'>Welcome back</h1>

          <TextInput
            id='email'
            label='Email'
            placeholder='Email'
            onChange={setEmail}
            value={email}
          />

          <TextInput
            id='password'
            label='Password'
            placeholder='Password'
            type='password'
            onChange={setPass}
            value={pass}
          />

          <Button onClick={() => console.log('hi')}>
            Login
          </Button>
        </div>
      </main>
    </div>
  )
}

export default Login
