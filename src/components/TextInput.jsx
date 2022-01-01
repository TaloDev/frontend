import React from 'react'
import PropTypes from 'prop-types'
import { focusStyle } from '../styles/theme'
import classNames from 'classnames'

const TextInput = (props) => {
  const inputClassName = classNames(`
    block
    p-2
    rounded
    w-full
    ${focusStyle}
    ${props.inputClassName || ''}
  `, {
    'bg-gray-600': !props.variant,
    'bg-gray-100 text-black': props.variant === 'light',
    'bg-white border border-gray-300 focus:border-opacity-0 disabled:bg-gray-200': props.variant === 'modal'
  })

  return (
    <div className='w-full'>
      {props.label && <label htmlFor={props.id} className='block font-semibold mb-1'>{props.label}</label>}
      <input
        id={props.id}
        className={inputClassName}
        type={props.type ?? 'text'}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value, e)}
        value={props.value}
        disabled={props.disabled}
      />
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
  disabled: PropTypes.bool
}

export default TextInput
