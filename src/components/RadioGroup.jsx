import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { labelFocusStyle } from '../styles/theme'

function RadioGroup({ label, name, options, onChange, value }) {
  const [focusedValue, setFocusedValue] = useState()

  return (
    <fieldset className='w-full'>
      {label && <legend className='font-semibold mb-1'>{label}</legend>}

      <div className='flex space-x-2'>
        {options.map((option, idx) => {
          const selected = option.value === value

          return (
            <div key={option.value} className='min-w-[100px]'>
              <input
                id={`${name}${idx}`}
                className='absolute inset-0 opacity-0'
                type='radio'
                name={name}
                onChange={() => onChange(option.value)}
                onFocus={() => setFocusedValue(option.value)}
                onBlur={() => setFocusedValue(null)}
              />

              <label
                htmlFor={`${name}${idx}`}
                className={classNames(
                  'block font-semibold border border-gray-300 p-2 rounded cursor-pointer transition-colors hover:bg-gray-100',
                  { 'bg-indigo-500 hover:!bg-indigo-500 border-indigo-500': selected },
                  { [labelFocusStyle]: option.value === focusedValue }
                )}
              >
                <span className={classNames('inline-block relative rounded-full w-4 h-4 bg-white align-text-bottom border border-gray-300', { 'border-indigo-500': selected })}>
                  {selected &&
                    <span className='absolute inset-0 rounded-full bg-indigo-300 m-0.5' />
                  }
                </span>

                <span className={classNames('ml-1', { 'text-white': selected })}>{option.label}</span>
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}

RadioGroup.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any
}

export default RadioGroup
