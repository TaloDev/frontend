import { useState } from 'react'
import type { MouseEvent } from 'react'
import Button from '../components/Button'
import Link from '../components/Link'
import { useSetRecoilState } from 'recoil'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import { unauthedContainerStyle } from '../styles/theme'
import AuthService from '../services/AuthService'
import createDemo from '../api/createDemo'
import userState from '../state/userState'

export default function Demo() {
  const setUser = useSetRecoilState(userState)
  const [error, setError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)

  const onLaunchClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { accessToken, user } = await createDemo()
      AuthService.setToken(accessToken)
      setUser(user)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={`text-white space-y-8 ${unauthedContainerStyle}`}>
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
