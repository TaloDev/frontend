import { clsx } from 'clsx'
import { ReactNode } from 'react'

export function UnauthedContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('flex h-full flex-col p-8 md:items-center md:justify-center', className)}>
      {children}
    </div>
  )
}
