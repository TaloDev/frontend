import React, { useState } from 'react'
import Button from '../components/Button'
import Link from '../components/Link'
import { useRecoilState } from 'recoil'
import userState from '../state/userState'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import { unauthedContainerStyle } from '../styles/theme'
import AuthService from '../services/AuthService'
import createDemo from '../api/createDemo'

const Demo = () => {
  const [, setUser] = useRecoilState(userState)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const onLaunchClick = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await createDemo()
      const accessToken = res.data.accessToken
      AuthService.setToken(accessToken)
      setUser(res.data.user)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={`text-white rounded-md space-y-8 ${unauthedContainerStyle}`}>
        <h1 className='text-4xl font-bold'>Browse the demo</h1>
        <p>
          You&apos;ll get to the read-only demo organisation for 1 hour. Some features are restricted in the demo environment but trust us, they work!
        </p>

        {error && <ErrorMessage error={error} />}

        <Button
          onClick={onLaunchClick}
          isLoading={isLoading}
        >
          Launch demo
        </Button>
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>Want to make an account? <Link to='/register'>Register here</Link></p>
      </div>
    </div>
  )
}

export default Demo
