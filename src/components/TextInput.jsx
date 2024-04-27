import { useState } from 'react'
import PropTypes from 'prop-types'
import { focusStyle } from '../styles/theme'
import clsx from 'clsx'
import { IconAlertCircle } from '@tabler/icons-react'
import requiredIf from 'react-required-if'

export default function TextInput({ id, onChange, value, label, placeholder = '', type, variant, inputClassName, disabled, errors, containerClassName, inputExtra = {}, startFocused }) {
  const [hasFocus, setHasFocus] = useState(false)

  const errorsToShow = errors?.filter((err) => err !== null && err !== undefined) ?? []
  const showErrorHighlight = !hasFocus && errorsToShow.length > 0

  const finalClassName = clsx(`
    block
    p-2
    w-full
    rounded
    disabled:bg-gray-300
    disabled:text-gray-700
    ${focusStyle}
    ${inputClassName ?? ''}
  `, {
    'bg-gray-600': !variant,
    'bg-gray-100 text-black': variant === 'light',
    'bg-white border border-gray-300 focus:border-opacity-0': variant === 'modal'
  })

  return (
    <div>
      <div className={clsx('w-full inline-block', containerClassName)}>
        {label &&
          <label htmlFor={id} className='flex justify-between items-end font-semibold mb-2'>
            {label}
            {errorsToShow.length > 0 && <span><IconAlertCircle className='inline -mt-0.5 text-red-500' size={20} /></span>}
          </label>
        }

        <div className='relative'>
          <input
            id={id}
            className={finalClassName}
            type={type ?? 'text'}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value, e)}
            value={value}
            disabled={disabled}
            {...inputExtra}
            onFocus={(e) => {
              inputExtra.onFocus?.(e)
              setHasFocus(true)
            }}
            onBlur={(e) => {
              inputExtra.onBlur?.(e)
              setHasFocus(false)
            }}
          />

          {showErrorHighlight && <div className='h-1 bg-red-500 absolute bottom-0 left-0 right-0 rounded-bl rounded-br' />}
        </div>
      </div>

      {errorsToShow.filter((err) => {
        // filter out empty string errors so they dont render and create dead space
        return Boolean(err)
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
