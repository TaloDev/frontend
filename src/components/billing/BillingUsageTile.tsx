import Tile from '../Tile'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import pricingPlanActionTypes from '../../constants/pricingPlanActionTypes'
import clsx from 'clsx'
import { PricingPlanUsage } from '../../entities/pricingPlan'

type BillingUsageTileProps = {
  usage: PricingPlanUsage
  usageError: TaloError | null
}

export default function BillingUsageTile({
  usage,
  usageError
}: BillingUsageTileProps) {
  return (
    <li>
      <Tile
        header={<h2 className='text-xl font-semibold'>Usage</h2>}
        content={
          <>
            {!usageError &&
              <ul className='w-full space-y-2'>
                {pricingPlanActionTypes.map((name, idx) => {
                  const limit = usage[idx].limit
                  const used = usage[idx].used

                  return (
                    <li key={idx} className='flex items-center'>
                      <p className='w-40'>{name}</p>
                      <p
                        data-testid={name + '-usage'}
                        className={clsx('w-20 font-semibold font-mono text-right', { 'text-orange-400': used >= limit })}
                      >
                        {used}/{limit}
                      </p>

                      <div className='h-3 w-full bg-gray-900 rounded-sm relative ml-4'>
                        <div
                          className={clsx('absolute h-3 bg-white rounded-sm', { '!bg-orange-400': used >= limit })}
                          style={{ width: `${Math.min(100, used / limit * 100)}%` }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            }
          </>
        }
        footer={(
          <>
            {usageError &&
              <div className='px-4'><ErrorMessage error={usageError} /></div>
            }
          </>
        )}
      />
    </li>
  )
}
