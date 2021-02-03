import React, { useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Link from '../components/Link'
import { useRecoilState } from 'recoil'
import accessState from '../state/accessState'
import userState from '../state/userState'
import ErrorMessage from '../components/ErrorMessage'
import login from '../api/login'
import buildError from '../utils/buildError'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import attachTokenInterceptor from '../utils/attachTokenInterceptor'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setAccessToken] = useRecoilState(accessState)
  const [, setUser] = useRecoilState(userState)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const onLoginClick = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await login({ email, password })
      const accessToken = res.data.accessToken
      setUser(res.data.user)
      setAccessToken(accessToken)
      attachTokenInterceptor(accessToken, setAccessToken)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={`text-white rounded-md flex flex-col space-y-8 ${unauthedContainerStyle}`}>
        <h1 className='text-4xl font-bold'>Welcome back</h1>

        <TextInput
          autoFocus
          id='email'
          label='Email'
          type='email'
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

        <ErrorMessage error={error}>
          {error?.showHint &&
            <span>. Have you <Link to={routes.forgotPass}>forgotten your password?</Link></span>
          }
        </ErrorMessage>

        <Button
          disabled={!email || !password || isLoading}
          onClick={onLoginClick}
          isLoading={isLoading}
        >
          Login
        </Button>
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>Need an account? <Link to='/register'>Register here</Link></p>
      </div>
    </div>
  )
}

export default Login
