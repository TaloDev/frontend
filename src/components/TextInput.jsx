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
    'bg-gray-100 text-black focus:ring-indigo-400': props.variant === 'light'
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
  inputClassName: PropTypes.string
}

export default TextInput
