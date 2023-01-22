import PropTypes from 'prop-types'
import Tile from '../Tile'
import ErrorMessage from '../ErrorMessage'
import pricingPlanActionTypes from '../../constants/pricingPlanActionTypes'
import classNames from 'classnames'

export default function BillingUsageTile({ usage, usageError }) {
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

BillingUsageTile.propTypes = {
  usage: PropTypes.object.isRequired,
  usageError: PropTypes.object
}
