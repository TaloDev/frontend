import React from 'react'
import PropTypes from 'prop-types'

const ChartTick = (props) => {
  return (
    <g transform={props.transform(props.x, props.y)}>
      <text x={0} y={0} dy={16} textAnchor='end' className='fill-current text-white text-sm'>
        {props.formatter(props.payload.value)}
      </text>
    </g>
  )
}

ChartTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
  formatter: PropTypes.func.isRequired,
  transform: PropTypes.func.isRequired
}

export default ChartTick
