import { ReactNode, useCallback, useEffect } from 'react'
import { IconX } from '@tabler/icons-react'
import Button from './Button'
import clsx from 'clsx'
import usePortal from '../utils/usePortal'
import { createPortal } from 'react-dom'
import FocusLock from 'react-focus-lock'

type ModalProps = {
  id: string
  title: string
  hideTitle?: boolean
  children: ReactNode
  modalState: [boolean, (open: boolean) => void]
  scroll?: boolean
}

export default function Modal({
  id,
  title,
  hideTitle,
  children,
  modalState,
  scroll = true
}: ModalProps) {
  const [, setOpen] = modalState

  const handleEscapePressed = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') setOpen(false)
  }, [setOpen])

  useEffect(() => {
    document.addEventListener('keydown', handleEscapePressed)

    return () => {
      document.removeEventListener('keydown', handleEscapePressed)
    }
  }, [handleEscapePressed])

  const target = usePortal(id)

  return createPortal(
    <FocusLock>
      <div className='fixed w-screen md:p-4 bg-gray-900 bg-opacity-60 flex items-start md:items-center justify-center inset-0 z-50 text-black transition-colors'>
        <dialog
          className={clsx('block w-full h-full md:h-auto md:w-[640px] bg-white md:rounded p-0', {
            'overflow-y-scroll': scroll,
            'overflow-y-visible': !scroll
          })}
          aria-modal='true'
          aria-labelledby={`modal-${id}-label`}
        >
          <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
            <h2
              id={`modal-${id}-label`}
              className={clsx('text-xl font-semibold', { 'hidden': hideTitle })}
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
    </FocusLock>,
    target
  )
}
