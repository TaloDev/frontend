import React from 'react'
import PropTypes from 'prop-types'

const TableCell = (props) => {
  return (
    <td className={`p-4 min-w-40 ${props.className}`}>{props.children}</td>
  )
}

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

export default TableCell
