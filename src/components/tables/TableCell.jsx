import React from 'react'
import PropTypes from 'prop-types'

const TableCell = (props) => {
  return (
    <td
      className={`p-4 ${props.className.startsWith('min-w-') ? '' : 'min-w-40'} ${props.className}`}
    >
      {props.children}
    </td>
  )
}

TableCell.defaultProps = {
  className: ''
}

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

export default TableCell
