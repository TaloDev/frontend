import type { ReactNode } from 'react'
import clsx from 'clsx'

type TableBodyProps<T> = {
  iterator: T[]
  children: (iteraee: T, idx: number) => ReactNode
  startIdx?: number
  configureClassnames?: (iteraee: T, idx: number) => { [key: string]: boolean }
}

export default function TableBody<T>({
  iterator,
  children,
  startIdx = 0,
  configureClassnames,
}: TableBodyProps<T>) {
  return (
    <tbody>
      {iterator.map((iteraee, idx) => (
        <tr
          key={idx}
          className={clsx({
            'bg-indigo-600': (startIdx + idx) % 2 !== 0,
            'bg-indigo-500': (startIdx + idx) % 2 === 0,
            ...configureClassnames?.(iteraee, startIdx + idx),
          })}
        >
          {children(iteraee, idx)}
        </tr>
      ))}
    </tbody>
  )
}
