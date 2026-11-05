import type { ReactNode } from 'react'
import clsx from 'clsx'
import { motion } from 'motion/react'

type TableBodyProps<T> = {
  iterator: T[]
  children: (iteraee: T, idx: number) => ReactNode
  startIdx?: number
  configureClassnames?: (iteraee: T, idx: number) => { [key: string]: boolean }
  rowKey?: (iteraee: T, idx: number) => string | number
}

export default function TableBody<T>({
  iterator,
  children,
  startIdx = 0,
  configureClassnames,
  rowKey,
}: TableBodyProps<T>) {
  return (
    <tbody>
      {iterator.map((iteraee, idx) => (
        <motion.tr
          // a stable key follows the row when the order changes, which motion animates
          key={rowKey ? rowKey(iteraee, startIdx + idx) : idx}
          layout={Boolean(rowKey)}
          transition={{ duration: 0.2 }}
          className={clsx({
            'bg-indigo-600': (startIdx + idx) % 2 !== 0,
            'bg-indigo-500': (startIdx + idx) % 2 === 0,
            ...configureClassnames?.(iteraee, startIdx + idx),
          })}
        >
          {children(iteraee, idx)}
        </motion.tr>
      ))}
    </tbody>
  )
}
