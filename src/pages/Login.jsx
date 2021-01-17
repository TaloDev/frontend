import { useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Link from '../components/Link'
import login from '../api/login'
import refreshAccess from '../api/refreshAccess'
import { useRecoilState } from 'recoil'
import accessState from '../atoms/accessState'
import isAccessTokenValid from '../utils/isAccessTokenValid'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accessToken, setAccessToken] = useRecoilState(accessState)

  const containerSize = 'w-full md:w-2/3 xl:w-1/3'

  const onLoginClick = async (e) => {
    e.preventDefault()

    try {
      const res = await login({ email, password })
      setAccessToken(res.data.accessToken)
      axios.interceptors.request.use(async (config) => {
        let token = res.data.accessToken

        // if (!isAccessTokenValid(token)) {
        //   try {
        //     console.log('invalid token')

        //     const res = await refreshAccess()
        //     const newToken = res.data.accessToken
        //     setAccessToken(newToken)
        //     token = newToken
        //   } catch (err) {
        //     // logout
        //     throw new Error('logout')
        //   }
        // }

        config.headers.authorization = `Bearer ${token}`
        return config
      }, (error) => {
        return Promise.reject(error)
      })
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
