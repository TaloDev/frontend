import { IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import { ReactNode, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import FocusLock from 'react-focus-lock'
import Button from './Button'

type ModalProps = {
  id: string
  title: string
  hideTitle?: boolean
  children: ReactNode
  footer?: ReactNode
  modalState: [boolean, (open: boolean) => void]
  scroll?: boolean
  className?: string
}

export default function Modal({
  id,
  title,
  hideTitle,
  children,
  footer,
  modalState,
  scroll = true,
  className,
}: ModalProps) {
  const [, setOpen] = modalState

  const handleEscapePressed = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    },
    [setOpen],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscapePressed)

    return () => {
      document.removeEventListener('keydown', handleEscapePressed)
    }
  }, [handleEscapePressed])

  return createPortal(
    <FocusLock>
      <div className='fixed inset-0 z-50 flex w-screen items-start overflow-y-auto bg-gray-900/60 text-black transition-colors md:items-center md:p-4'>
        <dialog
          className={clsx(
            'flex h-full w-full flex-col bg-white p-0 md:mx-auto md:h-auto md:max-h-[calc(100vh-2rem)] md:w-160 md:rounded',
            className,
          )}
          aria-modal='true'
          aria-labelledby={`modal-${id}-label`}
        >
          <div className='flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4'>
            <h2
              id={`modal-${id}-label`}
              className={clsx('text-xl font-semibold', { hidden: hideTitle })}
            >
              {title}
            </h2>

            <Button
              variant='icon'
              onClick={() => setOpen(false)}
              icon={<IconX />}
              extra={{ 'aria-label': 'Close modal' }}
            />
          </div>

          <div
            className={clsx('min-h-0 flex-1', {
              'overflow-y-auto': scroll,
              'overflow-y-visible': !scroll,
            })}
          >
            {children}
          </div>

          {footer && <div className='flex-shrink-0'>{footer}</div>}
        </dialog>
      </div>
    </FocusLock>,
    document.body,
  )
}
