import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { IconCheck } from '@tabler/icons'

const ColourfulCheckbox = (props) => {

  return (
    <>
      <input id={props.id} type='checkbox' className='absolute opacity-0' {...props} />
      <label htmlFor={props.id}>
        <span
          className={classNames('inline-block rounded w-4 h-4 align-text-bottom' ,{ 'bg-white': !props.checked })}
          style={{ backgroundColor: props.checked ? props.colour : '' }}
        >
          {props.checked &&
            <span className='flex items-center justify-center h-full'>
              <IconCheck size={12} stroke={3} color='white' />
            </span>
          }
        </span>
        <span className='ml-2 text-sm'>{props.label}</span>
      </label>
    </>
  )
}

ColourfulCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  colour: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}

export default ColourfulCheckbox
