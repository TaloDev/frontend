import React from 'react'
import { useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Link from '../components/Link'
import { useRecoilState } from 'recoil'
import accessState from '../state/accessState'
import userState from '../state/userState'
import register from '../api/register'
import ErrorMessage from '../components/ErrorMessage'
import { unauthedContainerStyle } from '../styles/theme'
import buildError from '../utils/buildError'
import attachTokenInterceptor from '../utils/attachTokenInterceptor'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setAccessToken] = useRecoilState(accessState)
  const [, setUser] = useRecoilState(userState)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const onRegisterClick = async (e) => {
    e.preventDefault()
    setError(null)

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(email)) {
      setError(buildError('Please enter a valid email address'))
      return
    }

    setLoading(true)

    try {
      const res = await register({ email, password, organisationName: name })
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
      <form className={`text-white rounded-md space-y-8 ${unauthedContainerStyle}`}>
        <h1 className='text-4xl font-bold'>Let&apos;s get started</h1>

        <TextInput
          id='name'
          label='Name'
          placeholder={`Your name or your team/organisation's name`}
          type='text'
          onChange={setName}
          value={name}
        />

        <TextInput
          id='email'
          label='Email'
          type='email'
          placeholder='Purely for functional uses'
          onChange={setEmail}
          value={email}
        />

        <TextInput
          id='password'
          label='Password'
          placeholder='Keep it secure'
          type='password'
          onChange={setPassword}
          value={password}
        />

        <ErrorMessage error={error} />

        <Button
          disabled={!name || !email || !password}
          onClick={onRegisterClick}
          isLoading={isLoading}
        >
          Sign up
        </Button>
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>Already have an account? <Link to='/'>Log in here</Link></p>
      </div>
    </div>
  )
}

export default Register
