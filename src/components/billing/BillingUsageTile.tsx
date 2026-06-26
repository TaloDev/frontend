import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import { PlayerUsageBreakdown, PricingPlanUsage } from '../../entities/pricingPlan'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import Tile from '../Tile'

type BillingUsageTileProps = {
  usage: PricingPlanUsage
  breakdown: PlayerUsageBreakdown
  usageError: TaloError | null
}

export default function BillingUsageTile({ usage, breakdown, usageError }: BillingUsageTileProps) {
  const total = breakdown.live + breakdown.dev + breakdown.deleted
  const denom = Math.max(usage.limit, total)
  const pct = (n: number) => (denom ? (n / denom) * 100 : 0)

  return (
    <li>
      <Tile
        header={<h2 className='text-xl font-semibold'>Usage</h2>}
        content={
          <>
            {!usageError && (
              <ul className='w-full space-y-2'>
                <li>
                  <div className='flex items-center'>
                    <p className='w-40 shrink-0'>Players</p>
                    <p
                      data-testid='players-usage'
                      className={clsx('w-40 shrink-0 text-right font-mono text-sm font-semibold', {
                        'text-orange-400': usage.used >= usage.limit,
                      })}
                    >
                      {usage.used.toLocaleString()} / {usage.limit.toLocaleString()}
                    </p>
                    <Tippy
                      placement='top'
                      content={
                        <div className='flex flex-col space-y-1 p-2'>
                          <span className='flex items-center'>
                            <span className='mr-2 inline-block h-2 w-2 rounded-full bg-indigo-400' />
                            {breakdown.live.toLocaleString()} live
                          </span>
                          <span className='flex items-center'>
                            <span className='mr-2 inline-block h-2 w-2 rounded-full bg-orange-500' />
                            {breakdown.dev.toLocaleString()} dev
                          </span>
                          <span className='flex items-center'>
                            <span className='mr-2 inline-block h-2 w-2 rounded-full bg-white' />
                            {breakdown.deleted.toLocaleString()} deleted this month
                          </span>
                        </div>
                      }
                    >
                      <div
                        className='ml-4 flex h-3 w-full overflow-hidden rounded-sm bg-gray-900'
                        aria-label={`${breakdown.live} live, ${breakdown.dev} dev, ${breakdown.deleted} deleted this month`}
                      >
                        <div
                          className='h-3 bg-indigo-400'
                          style={{ width: `${pct(breakdown.live)}%` }}
                        />
                        <div
                          className='h-3 bg-orange-500'
                          style={{ width: `${pct(breakdown.dev)}%` }}
                        />
                        <div
                          className='h-3 bg-white'
                          style={{ width: `${pct(breakdown.deleted)}%` }}
                        />
                      </div>
                    </Tippy>
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
