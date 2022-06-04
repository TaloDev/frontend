import React, { useState } from 'react'
import Tile from '../Tile'
import Button from '../Button'
import buildError from '../../utils/buildError'
import ErrorMessage from '../ErrorMessage'
import createPortalSession from '../../api/createPortalSession'
import { IconExternalLink } from '@tabler/icons'
import usePricingPlanUsage from '../../api/usePricingPlanUsage'
import Loading from '../Loading'
import pricingPlanActionTypes from '../../constants/pricingPlanActionTypes'
import classNames from 'classnames'

export default function BillingUsage() {
  const { usage, loading: usageLoading, error: usageError } = usePricingPlanUsage()

  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState(null)

  const onBillingPortalClick = async () => {
    setPortalLoading(true)
    setPortalError(null)

    try {
      const res = await createPortalSession()
      window.location.assign(res.data.redirect)
    } catch (err) {
      setPortalLoading(false)
      setPortalError(buildError(err))
    }
  }

  return (
    <>
      <li>
        <Tile
          header={<h2 className='text-xl font-semibold'>Usage</h2>}
          content={usageLoading ? (
            <div className='w-full flex justify-center'>
              <Loading size={24} thickness={180} />
            </div>
          ) : (
            <>
              <ul className='w-full space-y-2'>
                {pricingPlanActionTypes.map((name, idx) => {
                  const limit = usage[idx].limit
                  const used = usage[idx].used

                  return (
                    <li key={idx} className='flex items-center'>
                      <p className='w-40'>{name}</p>
                      <p className={classNames('w-20 font-semibold font-mono text-right', { 'text-orange-400': used >= limit })}>{used}/{limit}</p>

                      <div className='h-3 w-full bg-gray-900 rounded-sm relative ml-4'>
                        <div
                          className={classNames('absolute h-3 bg-white rounded-sm', { '!bg-orange-400': used >= limit })}
                          style={{ width: `${Math.min(100, used/limit * 100)}%` }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
          footer={(
            <>
              {usageError &&
                <div className='px-4'><ErrorMessage error={usageError} /></div>
              }
            </>
          )}
        />
      </li>

      <li>
        <Tile
          header={(
            <>
              <h2 className='text-xl font-semibold'>Billing details</h2>
              <Button
                variant='grey'
                className='w-auto'
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
    </>
  )
}
