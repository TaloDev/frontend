import { useState } from 'react'
import Button from '../Button'
import buildError from '../../utils/buildError'
import createPortalSession from '../../api/createPortalSession'
import { IconExternalLink } from '@tabler/icons-react'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import Tile from '../Tile'

export default function BillingPortalTile() {
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<TaloError | null>(null)

  const onBillingPortalClick = async () => {
    setPortalLoading(true)
    setPortalError(null)

    try {
      const { redirect } = await createPortalSession()
      window.location.assign(redirect)
    } catch (err) {
      setPortalLoading(false)
      setPortalError(buildError(err))
    }
  }

  return (
    <li>
      <Tile
        header={(
          <>
            <h2 className='text-xl font-semibold'>Billing details</h2>
            <Button
              variant='grey'
              className='!w-auto'
              onClick={onBillingPortalClick}
              isLoading={portalLoading}
              icon={<IconExternalLink />}
            >
              <span>Billing Portal</span>
            </Button>
          </>
        )}
        content={(
          <div>
            <p>You can update your billing information and view invoices inside the billing portal</p>
          </div>
        )}
        footer={(
          <>
            {portalError &&
              <div className='px-4'><ErrorMessage error={portalError} /></div>
            }
          </>
        )}
      />
    </li>
  )
}
