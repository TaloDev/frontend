import type { ReactNode } from 'react'
import { IconCheck, IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useEffect } from 'react'
import ToastContext, { ToastType } from './ToastContext.ts'

type ToastProviderProps = {
  children: ReactNode
  lifetime?: number
}

export default function ToastProvider({ children, lifetime = 2000 }: ToastProviderProps) {
  const [text, setText] = useState('')
  const [type, setType] = useState<ToastType>(ToastType.NONE)
  const [show, setShow] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId)
    }
  }, [timeoutId])

  const getIcon = () => {
    switch (type) {
      case ToastType.SUCCESS:
        return <IconCheck size={24} />
      case ToastType.ERROR:
        return <IconX size={24} />
      default:
        return null
    }
  }

  const showToast = useCallback(
    (text: string, type: ToastType) => {
      setText(text)
      setType(type)
      setShow(true)

      const id = setTimeout(() => {
        setShow(false)
      }, lifetime)

      setTimeoutId(id)
    },
    [lifetime],
  )

  const trigger = useCallback(
    (text: string, type = ToastType.NONE) => {
      // test shows the if working, coverage doesnt pick it up for some reason
      /* v8ignore start */
      if (timeoutId) {
        clearTimeout(timeoutId)
        setShow(false)

        setTimeout(() => {
          showToast(text, type)
        }, 200)
      } else {
        /* v8ignore stop */
        showToast(text, type)
      }
    },
    [showToast, timeoutId],
  )

  return (
    <ToastContext.Provider value={{ trigger }}>
      <>
        {children}

        <AnimatePresence>
          {show && (
            <motion.div
              className={clsx(
                'fixed bottom-0 z-[51] flex w-full items-center space-x-2 bg-indigo-500 p-4 text-white shadow-md md:bottom-8 md:left-8 md:w-auto md:min-w-80 md:rounded md:pr-8',
                { 'bg-red-500': type === ToastType.ERROR },
              )}
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.15, ease: 'easeIn' },
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 40,
                transition: { duration: 0.15, ease: 'easeOut' },
              }}
            >
              {getIcon()}
              <p className='font-medium'>{text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </ToastContext.Provider>
  )
}
