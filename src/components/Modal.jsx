import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { IconX } from '@tabler/icons'
import Button from './Button'
import classNames from 'classnames'

const Modal = (props) => {
  const [, setOpen] = props.modalState

  const handleEscapePressed = (event) => {
    if (event.keyCode === 27) setOpen(false)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleEscapePressed)

    return () => {
      document.removeEventListener('keydown', handleEscapePressed)
    }
  }, [])

  return (
    <div className='fixed w-screen h-screen p-4 bg-gray-900 bg-opacity-60 flex items-start md:items-center justify-center inset-0 z-50 text-black transition-colors'>
      <dialog className='block w-full md:w-2/3 lg:w-2/5 xl:1/4 bg-white rounded p-0' aria-modal='true' aria-labelledby={`modal-${props.id}-label`}>
        <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
          <h2
            id={`modal-${props.id}-label`}
            className={classNames('text-xl font-semibold', { 'hidden': props.hideTitle })}
          >
            {props.title}
          </h2>

          <Button
            variant='icon'
            onClick={() => setOpen(false)}
            icon={<IconX />}
            extra={{ 'aria-label': 'Close modal' }}
          />
        </div>

        {props.children}
      </dialog>
    </div>
  )
}

Modal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  hideTitle: PropTypes.bool,
  children: PropTypes.any.isRequired,
  modalState: PropTypes.array.isRequired
}

export default Modal
