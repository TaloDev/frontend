import TableHeader from './TableHeader'
import type { ReactNode } from 'react'

type TableProps = {
  columns: string[]
  children: ReactNode
}

export default function Table({
  columns,
  children
}: TableProps) {
  return (
    <div className='overflow-x-scroll'>
      <table className='table-auto w-full'>
        <TableHeader columns={columns} />
        {children}
      </table>
    </div>
  )
}
