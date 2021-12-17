import React from 'react'
import PropTypes from 'prop-types'
import { IconArrowLeft } from '@tabler/icons'
import Button from './Button'
import { useHistory } from 'react-router-dom'
import classNames from 'classnames'

function Title({ children, showBackButton, className }) {
  const history = useHistory()

  return (
    <header className={classNames('flex items-center', className)}>
      {showBackButton &&
        <Button
          variant='bare'
          className='mr-2 bg-indigo-600 rounded-full p-1'
          onClick={history.goBack}
          icon={<IconArrowLeft size={20} />}
          extra={{ 'aria-label': 'Go back' }}
        />
      }

      <h1 className='text-2xl md:text-4xl font-bold'>{children}</h1>
    </header>
  )
}

Title.propTypes = {
  children: PropTypes.node.isRequired,
  showBackButton: PropTypes.bool,
  className: PropTypes.string
}

export default Title
