import React from 'react'
import PropTypes from 'prop-types'

const TableHeader = (props) => {
  return (
    <thead className='bg-white text-black font-semibold'>
      <tr>
        {props.columns.map((col, idx) => (
          <th key={idx} className='p-4 text-left'>{col}</th>
        ))}
      </tr>
    </thead>
  )
}

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default TableHeader
