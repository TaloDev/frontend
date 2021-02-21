import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const TableBody = (props) => {
  return (
    <tbody>
      {props.iterator.map((player, idx) => (
        <tr key={player.id} className={classNames({ 'bg-indigo-600': idx % 2 !== 0, 'bg-indigo-500': idx % 2 === 0 })}>
          {props.children(player)}
        </tr>
      ))}
    </tbody>
  )
}

TableBody.propTypes = {
  iterator: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired
}

export default TableBody
