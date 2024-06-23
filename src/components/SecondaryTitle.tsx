import clsx from 'clsx'
import type { ReactNode } from 'react'

type SecondaryTitleProps = {
  className?: string
  children: ReactNode
}

export default function SecondaryTitle({
  className,
  children
}: SecondaryTitleProps) {
  return <h2 className={clsx('text-2xl', className)}>{children}</h2>
}
