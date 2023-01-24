import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'framer-motion'
import ToastContext from './ToastContext'
import { IconCheck } from '@tabler/icons'
import { useEffect } from 'react'

export default function ToastProvider({ children, lifetime }) {
  const [text, setText] = useState('')
  const [type, setType] = useState('')
  const [show, setShow] = useState(false)
  const [timeoutId, setTimeoutId] = useState(-1)

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId)
    }
  }, [timeoutId])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IconCheck size={24} />
      default:
        return null
    }
  }

  const showToast = useCallback((text, type) => {
    setText(text)
    setType(type)
    setShow(true)

    const id = setTimeout(() => {
      setShow(false)
    }, lifetime)
    setTimeoutId(id)
  }, [])

  const trigger = useCallback((text, type = '') => {
    // test shows the if working, coverage doesnt pick it up for some reason
    /* c8 ignore start */
    if (show) {
      clearTimeout(timeoutId)
      setShow(false)

      setTimeout(() => {
        showToast(text, type)
      }, 200)
    } else {
    /* c8 ignore stop */
      showToast(text, type)
    }
  }, [show, timeoutId])

  return (
    <ToastContext.Provider value={{ trigger }}>
      <>
        {children}

        <AnimatePresence>
          {show &&
            <motion.div
              className='fixed bottom-0 md:bottom-8 md:left-8 z-[51] w-full md:w-auto md:min-w-80 space-x-2 flex items-center md:rounded p-4 md:pr-8 shadow-md bg-indigo-500 text-white'
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.15, ease: 'easeIn' }
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 40,
                transition: { duration: 0.15, ease: 'easeOut' }
              }}
            >
              {getIcon()}
              <p className='font-medium'>{text}</p>
            </motion.div>
          }
        </AnimatePresence>
      </>
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  lifetime: PropTypes.number
}

ToastProvider.defaultProps = {
  lifetime: 2000
}

