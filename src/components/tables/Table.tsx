import type { ReactNode } from 'react'
import TableHeader from './TableHeader'

type TableProps = {
  columns: string[]
  children: ReactNode
}

export default function Table({ columns, children }: TableProps) {
  return (
    <div className='overflow-x-scroll'>
      <table className='w-full table-auto'>
        <TableHeader columns={columns} />
        {children}
      </table>
    </div>
  )
}
