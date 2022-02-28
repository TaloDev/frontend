import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { focusStyle } from '../styles/theme'
import classNames from 'classnames'
import { IconAlertCircle } from '@tabler/icons'

const TextInput = (props) => {
  const [hasFocus, setFocus] = useState(false)

  const showErrorHighlight = !hasFocus && props.errors?.length > 0

  const inputClassName = classNames(`
    block
    p-2
    w-full
    rounded
    ${focusStyle}
    ${props.inputClassName || ''}
  `, {
    'bg-gray-600': !props.variant,
    'bg-gray-100 text-black': props.variant === 'light',
    'bg-white border border-gray-300 focus:border-opacity-0 disabled:bg-gray-200': props.variant === 'modal'
  })

  return (
    <div className='w-full'>
      {props.label &&
        <label htmlFor={props.id} className='flex justify-between items-end font-semibold mb-2'>
          {props.label}
          {props.errors?.length > 0 && <span className=''><IconAlertCircle className='inline -mt-0.5 text-red-500' size={20} /></span>}
        </label>
      }

      <div className='relative'>
        <input
          id={props.id}
          className={inputClassName}
          type={props.type ?? 'text'}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value, e)}
          value={props.value}
          disabled={props.disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />

        {showErrorHighlight && <div className='h-1 bg-red-500 absolute bottom-0 left-0 right-0 rounded-bl rounded-br' />}
      </div>

      {props.errors?.map((error, idx) => <p role='alert' key={idx} className='text-red-500 font-medium mt-2'>{error}</p>)}
    </div>
  )
}

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
  variant: PropTypes.string,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string)
}

export default TextInput
