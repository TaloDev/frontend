import React from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import uniqBy from 'lodash.uniqby'
import randomColor from 'randomcolor'

const ChartTooltip = (props) => {
  const filteredItems = props.payload?.filter((item) => item.payload.count > 0)

  if (!props.active || filteredItems?.length === 0) return null

  return (
    <div className='bg-white p-4 rounded'>
      <p className='text-black font-medium mb-2'>{format(new Date(props.label), 'do MMM yyyy')}</p>
      <ul>
        {uniqBy(filteredItems, 'payload.name')
          .sort((a, b) => b.payload.count - a.payload.count)
          .map((item, idx) => (
            <li key={idx}>
              <p className='text-black text-md'>
                <span className='mr-2 w-4 h-4 rounded inline-block align-text-bottom' style={{ backgroundColor: randomColor({ seed: item.payload.name }) }} />
                {item.payload.name}: {item.payload.count}
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
