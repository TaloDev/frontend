import type { ReactNode } from 'react'
import { IconAlertCircle } from '@tabler/icons-react'
import clsx from 'clsx'

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

function ErrorMessage({ error, children, className }: ErrorMessageProps) {
  const hasMultipleErrors = error?.hasKeys && Object.keys(error.keys!).length > 1

  return (
    <div className={clsx('w-auto rounded bg-red-500 p-4', className)}>
      <div
        className={clsx('flex text-white', {
          'items-center': !hasMultipleErrors,
          'items-start': hasMultipleErrors,
        })}
      >
        <IconAlertCircle />
        <div className='ml-2 w-full font-bold'>
          {error?.hasKeys &&
            Object.entries(error.keys!).map(([key, value]) => (
              <p key={key} className='text-sm' role='alert'>
                {key}: {value.join(', ')}
              </p>
            ))}

          {!error?.hasKeys && error?.message && <p role='alert'>{error.message}</p>}

          {children}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
