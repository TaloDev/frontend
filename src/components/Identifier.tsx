import type { ReactNode } from 'react'
import { clsx } from 'clsx'

type IdentifierProps = {
  id: string
  innerClassName?: string
  children?: ReactNode
}

export default function Identifier({ id, innerClassName, children }: IdentifierProps) {
  return (
    <div>
      <code className={clsx('rounded bg-gray-900 p-2 text-xs md:text-sm', innerClassName)}>
        {children}
        {id}
      </code>
    </div>
  )
}
