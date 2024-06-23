import { IconAlertCircle } from '@tabler/icons-react'
import clsx from 'clsx'
import type { ReactNode } from 'react'

export type TaloError = {
  message: string,
  keys?: { [key: string]: string[] },
  hasKeys?: boolean,
  extra?: { [key: string]: string[] }
}

type ErrorMessageProps = {
  error: TaloError | null
  children?: ReactNode
  className?: string
}

function ErrorMessage({
  error,
  children,
  className
}: ErrorMessageProps) {
  return (
    <div className={clsx('bg-red-500 p-4 rounded w-auto', className)}>
      <div className='flex text-white'>
        <IconAlertCircle />
        <p className='font-bold w-full ml-2' role='alert'>
          {error?.message}
          {children}
        </p>
      </div>
    </div>
  )
}

export default ErrorMessage
