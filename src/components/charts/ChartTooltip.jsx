import React from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import uniqBy from 'lodash.uniqby'
import classNames from 'classnames'
import getEventColour from '../../utils/getEventColour'

const ChartTooltip = (props) => {
  const filteredItems = props.payload?.filter((item) => item.payload.count > 0)

  if (!props.active || filteredItems?.length === 0) return null

  return (
    <div className='bg-white p-4 rounded'>
      <p className='text-black font-medium mb-2'>{format(new Date(props.label), 'EEEE do MMM yyyy')}</p>
      <ul className='space-y-2'>
        {uniqBy(filteredItems, 'payload.name')
          .sort((a, b) => b.payload.count - a.payload.count)
          .map((item, idx) => (
            <li key={idx}>
              <p className='text-black text-sm'>
                <span className='mr-2 w-4 h-4 rounded inline-block align-text-bottom' style={{ backgroundColor: getEventColour(item.payload.name) }} />
                {item.payload.name}: {item.payload.count}

                <span className={classNames(
                  'p-1 rounded ml-2 text-xs',
                  {
                    'bg-red-100': item.payload.change < 0,
                    'bg-green-100': item.payload.change > 0,
                    'bg-gray-100': item.payload.change === 0
                  }
                )}>
                  {(item.payload.change * 100).toFixed(1)}%
                </span>
              </p>
            </li>
          ))}
      </ul>
    </div>
  )
}

ChartTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.any
}

export default ChartTooltip
