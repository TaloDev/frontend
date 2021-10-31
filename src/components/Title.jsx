import React from 'react'
import PropTypes from 'prop-types'
import { IconArrowLeft } from '@tabler/icons'
import Button from './Button'
import { useHistory } from 'react-router-dom'

const Title = (props) => {
  const history = useHistory()

  return (
    <header className='flex items-center'>
      {props.showBackButton &&
        <Button
          variant='bare'
          className='mr-2 bg-indigo-600 rounded-full p-1'
          onClick={history.goBack}
          icon={<IconArrowLeft size={20} />}
          extra={{ 'aria-label': 'Go back' }}
        />
      }

      <h1 className='text-2xl md:text-4xl font-bold'>{props.children}</h1>
    </header>
  )
}

Title.propTypes = {
  children: PropTypes.node.isRequired,
  showBackButton: PropTypes.bool
}

export default Title
