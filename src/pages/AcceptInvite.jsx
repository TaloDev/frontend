import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Link from '../components/Link'
import ErrorMessage from '../components/ErrorMessage'
import { unauthedContainerStyle } from '../styles/theme'
import buildError from '../utils/buildError'
import getInvite from '../api/getInvite'
import { useParams, useHistory } from 'react-router-dom'
import routes from '../constants/routes'

const AcceptInvite = () => {
  const { token } = useParams()

  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(true)

  const history = useHistory()

  useEffect(() => {
    (async () => {
      try {
        const res = await getInvite(token)
        history.push(routes.register, {
          invite: { ...res.data.invite, token }
        })
      } catch (err) {
        setError(buildError(err))
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={`text-white rounded-md space-y-8 ${unauthedContainerStyle}`}>
        {!isLoading && <h1 className='text-4xl font-bold'>Accept invite</h1>}

        {isLoading &&
          <div className='flex justify-center'>
            <Loading />
          </div>
        }

        {error && <ErrorMessage error={error} />}
      </form>

      {!isLoading &&
        <div className={unauthedContainerStyle}>
          <p className='mt-4 text-white'>Already have an account? <Link to='/'>Log in here</Link></p>
        </div>
      }
    </div>
  )
}

export default AcceptInvite
