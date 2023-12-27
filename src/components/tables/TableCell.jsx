import PropTypes from 'prop-types'
import clsx from 'clsx'

const TableCell = (props) => {
  return (
    <td
      className={clsx(
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
