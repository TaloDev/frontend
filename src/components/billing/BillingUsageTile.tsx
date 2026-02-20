import clsx from 'clsx'
import { PricingPlanUsage } from '../../entities/pricingPlan'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import Tile from '../Tile'

type BillingUsageTileProps = {
  usage: PricingPlanUsage
  usageError: TaloError | null
}

export default function BillingUsageTile({ usage, usageError }: BillingUsageTileProps) {
  return (
    <li>
      <Tile
        header={<h2 className='text-xl font-semibold'>Usage</h2>}
        content={
          <>
            {!usageError && (
              <ul className='w-full space-y-2'>
                <li className='flex items-center'>
                  <p className='w-40 shrink-0'>Players</p>
                  <p
                    data-testid='players-usage'
                    className={clsx('w-40 shrink-0 text-right font-mono text-sm font-semibold', {
                      'text-orange-400': usage.used >= usage.limit,
                    })}
                  >
                    {usage.used.toLocaleString()} / {usage.limit.toLocaleString()}
                  </p>

                  <div className='relative ml-4 h-3 w-full rounded-sm bg-gray-900'>
                    <div
                      className={clsx('absolute h-3 rounded-sm bg-white', {
                        '!bg-orange-400': usage.used >= usage.limit,
                      })}
                      style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }}
                    />
                  </div>
                </li>
              </ul>
            )}
          </>
        }
        footer={
          <>
            {usageError && (
              <div className='px-4'>
                <ErrorMessage error={usageError} />
              </div>
            )}
          </>
        }
      />
    </li>
  )
}
