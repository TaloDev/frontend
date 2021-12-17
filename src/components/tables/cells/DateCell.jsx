import React from 'react'
import PropTypes from 'prop-types'
import TableCell from '../TableCell'

const DateCell = (props) => {
  return (
    <TableCell className='min-w-60 lg:min-w-0'>
      {props.children}
    </TableCell>
  )
}

DateCell.propTypes = {
  children: PropTypes.node.isRequired
}

export default DateCell
