import PropTypes from 'prop-types'
import TableHeader from './TableHeader'

export default function Table({ columns, children }) {
  return (
    <div className='overflow-x-scroll'>
      <table className='table-auto w-full'>
        <TableHeader columns={columns} />
        {children}
      </table>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired
}
