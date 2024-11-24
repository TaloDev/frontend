import { IconAlertCircle } from '@tabler/icons-react'
import clsx from 'clsx'
import type { ReactNode } from 'react'

export type TaloError = {
  message: string
  keys?: { [key: string]: string[] }
  hasKeys?: boolean
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
  const hasMultipleErrors = error?.hasKeys && Object.keys(error.keys!).length > 1

  return (
    <div className={clsx('bg-red-500 p-4 rounded w-auto', className)}>
      <div className={clsx('flex text-white', { 'items-center': !hasMultipleErrors, 'items-start': hasMultipleErrors })}>
        <IconAlertCircle />
        <div className='font-bold w-full ml-2'>
          {error?.hasKeys &&
            Object.entries(error.keys!).map(([key, value]) => (
              <p key={key} className='text-sm' role='alert'>
                {key}: {value.join(', ')}
              </p>
            ))
          }

          {!error?.hasKeys && error?.message &&
            <p role='alert'>{error.message}</p>
          }

          {children}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
