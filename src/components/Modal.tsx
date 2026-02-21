import { IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import { ReactNode, useCallback, useEffect } from 'react'
import FocusLock from 'react-focus-lock'
import usePortal from 'react-useportal'
import Button from './Button'

type ModalProps = {
  id: string
  title: string
  hideTitle?: boolean
  children: ReactNode
  modalState: [boolean, (open: boolean) => void]
  scroll?: boolean
  className?: string
}

export default function Modal({
  id,
  title,
  hideTitle,
  children,
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

  const { Portal } = usePortal()

  return (
    <Portal>
      <FocusLock>
        <div className='fixed inset-0 z-50 flex w-screen items-start bg-gray-900/60 text-black transition-colors md:items-center md:p-4'>
          <dialog
            className={clsx(
              'block h-full w-full bg-white p-0 md:mx-auto md:h-auto md:w-[640px] md:rounded',
              className,
              {
                'overflow-y-scroll': scroll,
                'overflow-y-visible': !scroll,
              },
            )}
            aria-modal='true'
            aria-labelledby={`modal-${id}-label`}
          >
            <div className='flex items-center justify-between border-b border-gray-200 p-4'>
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

            {children}
          </dialog>
        </div>
      </FocusLock>
    </Portal>
  )
}
