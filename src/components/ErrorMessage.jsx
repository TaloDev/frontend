import React from 'react'
import PropTypes from 'prop-types'
import { IconAlertCircle } from '@tabler/icons'

function ErrorMessage({ error, children }) {
  return (
    <div className='bg-red-500 p-4 rounded w-auto'>
      <div className='flex'>
        <IconAlertCircle />
        <p className='font-bold text-white w-full ml-2' role='alert'>
          {error.message}
          {children}
        </p>
      </div>
    </div>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.object,
  children: PropTypes.any
}

export default ErrorMessage
