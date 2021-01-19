import { useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Link from '../components/Link'
import login from '../api/login'
import { useRecoilState } from 'recoil'
import accessState from '../atoms/accessState'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setAccessToken] = useRecoilState(accessState)

  const containerSize = 'w-full md:w-2/3 xl:w-1/3'

  const onLoginClick = async (e) => {
    e.preventDefault()

    try {
      const res = await login({ email, password })
      setAccessToken(res.data.accessToken)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='h-full'>
      <main className='h-full p-8 flex flex-col md:items-center md:justify-center'>
        <form className={`text-white rounded-md flex flex-col space-y-12 ${containerSize}`}>
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
            onChange={setPassword}
            value={password}
          />

          <Button
            disabled={!email || !password}
            onClick={onLoginClick}
          >
            Login
          </Button>
        </form>

        <p className={`mt-4 text-white ${containerSize}`}>Need an account? <Link to='/register'>Register here</Link></p>
      </main>
    </div>
  )
}

export default Login
