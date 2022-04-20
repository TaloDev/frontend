import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { focusStyle } from '../styles/theme'
import classNames from 'classnames'
import { IconAlertCircle } from '@tabler/icons'
import requiredIf from 'react-required-if'

function TextInput(props) {
  const [hasFocus, setHasFocus] = useState(false)

  const errors = props.errors?.filter((err) => err !== null && err !== undefined) ?? []
  const showErrorHighlight = !hasFocus && errors.length > 0

  const inputClassName = classNames(`
    block
    p-2
    w-full
    rounded
    disabled:bg-gray-300
    disabled:text-gray-700
    ${focusStyle}
    ${props.inputClassName ?? ''}
  `, {
    'bg-gray-600': !props.variant,
    'bg-gray-100 text-black': props.variant === 'light',
    'bg-white border border-gray-300 focus:border-opacity-0': props.variant === 'modal'
  })

  return (
    <div>
      <div className={classNames('w-full inline-block', props.containerClassName)}>
        {props.label &&
          <label htmlFor={props.id} className='flex justify-between items-end font-semibold mb-2'>
            {props.label}
            {errors.length > 0 && <span><IconAlertCircle className='inline -mt-0.5 text-red-500' size={20} /></span>}
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
            {...props.inputExtra}
            onFocus={() => {
              props.inputExtra.onFocus?.()
              setHasFocus(true)
            }}
            onBlur={() => {
              props.inputExtra.onBlur?.()
              setHasFocus(false)
            }}
          />

          {showErrorHighlight && <div className='h-1 bg-red-500 absolute bottom-0 left-0 right-0 rounded-bl rounded-br' />}
        </div>
      </div>

      {errors.filter((err) => {
        // filter out empty string errors so they dont render and create dead space
        return  Boolean(err)
      }).map((error, idx) => (
        <p role='alert' key={idx} className='text-red-500 font-medium mt-2'>{error}</p>
      ))}
    </div>
  )
}

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: requiredIf(PropTypes.func, (props) => !props.inputExtra?.name),
  value: requiredIf(PropTypes.string, (props) => !props.inputExtra?.name),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  containerClassName: PropTypes.string,
  inputExtra: PropTypes.object,
  startFocused: PropTypes.bool
}

TextInput.defaultProps = {
  inputExtra: {},
  placeholder: ''
}

export default TextInput
