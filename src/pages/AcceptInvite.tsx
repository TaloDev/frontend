import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import getInvite from '../api/getInvite'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Link from '../components/Link'
import Loading from '../components/Loading'
import { UnauthedContainer } from '../components/UnauthedContainer'
import { UnauthedContainerInner } from '../components/UnauthedContainerInner'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import buildError from '../utils/buildError'

export default function AcceptInvite() {
  const { token } = useParams()

  const [error, setError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    void (async () => {
      try {
        const { invite } = await getInvite(token!)
        navigate(routes.register, {
          state: {
            invite: { ...invite, token },
          },
        })
      } catch (err) {
        setError(buildError(err))
        setLoading(false)
      }
    })()
  }, [navigate, token])

  return (
    <UnauthedContainer>
      <UnauthedContainerInner as='form'>
        {!isLoading && <h1 className='text-4xl font-bold'>Accept invite</h1>}

        {isLoading && (
          <div className='flex justify-center'>
            <Loading />
          </div>
        )}

        {error && <ErrorMessage error={error} />}
      </UnauthedContainerInner>

      {!isLoading && (
        <div className={unauthedContainerStyle}>
          <p className='mt-4 text-white'>
            Already have an account? <Link to='/'>Log in here</Link>
          </p>
        </div>
      )}
    </UnauthedContainer>
  )
}
