import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const TableBody = (props) => {
  return (
    <tbody>
      {props.iterator.map((iterator, idx) => (
        <tr
          key={idx}
          className={classNames({
            'bg-indigo-600': (props.startIdx + idx) % 2 !== 0,
            'bg-indigo-500': (props.startIdx + idx) % 2 === 0
          })}
        >
          {props.children(iterator, idx)}
        </tr>
      ))}
    </tbody>
  )
}

TableBody.defaultProps = {
  startIdx: 0
}

TableBody.propTypes = {
  iterator: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  startIdx: PropTypes.number
}

export default TableBody
