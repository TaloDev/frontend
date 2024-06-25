import clsx from 'clsx'
import type { ReactNode } from 'react'

type TableCellProps = {
  children?: ReactNode
  className?: string
}

const TableCell = (props: TableCellProps) => {
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

export default TableCell
