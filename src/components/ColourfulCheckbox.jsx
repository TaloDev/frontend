import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { IconCheck } from '@tabler/icons'

const ColourfulCheckbox = (props) => {

  return (
    <>
      <input type='checkbox' className='absolute opacity-0' {...props} />
      <span
        className={classNames('inline-block rounded w-4 h-4 align-text-bottom' ,{ 'bg-white': !props.checked })}
        style={{ backgroundColor: props.checked ? props.colour : '' }}
      >
        {props.checked &&
          <span className='flex items-center justify-center h-full'>
            <IconCheck size={12} stroke={3} color='black' />
          </span>
        }
      </span>
    </>
  )
}

ColourfulCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  colour: PropTypes.string.isRequired
}

export default ColourfulCheckbox
