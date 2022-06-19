import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const TableCell = (props) => {
  return (
    <td
      className={classNames(
        'p-4',
        props.className,
        {
          'min-w-40': !props.className?.startsWith('min-w-')
        }
      )}
    >
      {props.children}
    </td>
  )
}

TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default TableCell
