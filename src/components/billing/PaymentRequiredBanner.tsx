import { MouseEvent, useState } from 'react'
import buildError from '../../utils/buildError'
import Button from '../Button'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import createPortalSession from '../../api/createPortalSession'
import { IconAlertCircle } from '@tabler/icons-react'

export default function PaymentRequiredBanner() {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const onUpdateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    setLoading(true)
    try {
      const { redirect } = await createPortalSession()
      window.location.assign(redirect)
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-gray-900 p-4 md:p-8 rounded-md w-full lg:2/3 xl:w-1/2 space-y-4' role='alert' data-testid='banner-content'>
      <div>
        <p className='text-xl font-bold'>
          <IconAlertCircle className='inline -mt-0.5 text-red-500 mr-2' size={24} />
          Payment failed
        </p>
        <p>Please update your payment details to continue your current price plan</p>
      </div>

      <form>
        <div className='w-full md:w-44'>
          <Button
            variant='grey'
            onClick={onUpdateClick}
            isLoading={isLoading}
          >
            Update details
          </Button>
        </div>
      </form>

      {error && <ErrorMessage error={error} />}
    </div>
  )
}
