import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { IconCheck } from '@tabler/icons'
import { labelFocusStyle } from '../styles/theme'

const ColourfulCheckbox = (props) => {
  const [focus, setFocus] = useState(false)

  return (
    <>
      <input
        id={props.id}
        type='checkbox'
        className='absolute inset-0 opacity-0'
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...props}
      />

      <label
        htmlFor={props.id}
        className={classNames('px-2 py-1 rounded block mb-2 bg-gray-900 border-r-8 cursor-pointer hover:bg-gray-800 transition-all', { [labelFocusStyle]: focus})}
        style={{ borderColor: props.colour }}
      >
        <span className='inline-block rounded w-4 h-4 bg-white align-text-bottom text-black active:bg-gray-300 transition-colors'>
          {props.checked &&
            <span className='flex items-center justify-center h-full'>
              <IconCheck size={14} stroke={3} /> 
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
