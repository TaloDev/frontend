import TableCell from '../TableCell'
import type { ReactNode } from 'react'

type DateCellProps = {
  children: ReactNode
}

const DateCell = (props: DateCellProps) => {
  return (
    <TableCell className='min-w-60 lg:min-w-40 xl:min-w-0'>
      {props.children}
    </TableCell>
  )
}

export default DateCell
