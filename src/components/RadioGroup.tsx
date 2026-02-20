import clsx from 'clsx'
import { useState } from 'react'
import { hiddenInputStyle, labelFocusStyle } from '../styles/theme'

type RadioGroupProps<T> = {
  label?: string
  name: string
  options: {
    label: string
    value: T
  }[]
  onChange: (value: T) => void
  value?: T
  info?: string
}

function RadioGroup<T>({ label, name, options, onChange, value, info }: RadioGroupProps<T>) {
  const [focusedValue, setFocusedValue] = useState<T | null>(null)

  return (
    <fieldset className='w-full'>
      {label && <legend className='mb-1 font-semibold'>{label}</legend>}
      {info && <p className='mb-2 text-sm text-gray-500'>{info}</p>}

      <div className='flex space-x-2'>
        {options.map((option, idx) => {
          const selected = option.value === value

          return (
            <div key={String(option.value)} className='min-w-[96px]'>
              <input
                id={`${name}${idx}`}
                className={hiddenInputStyle}
                type='radio'
                name={name}
                onChange={() => onChange(option.value)}
                onFocus={() => setFocusedValue(option.value)}
                onBlur={() => setFocusedValue(null)}
                checked={selected}
                value={String(option.value)}
              />

              <label
                htmlFor={`${name}${idx}`}
                className={clsx(
                  'block cursor-pointer rounded border border-black/30 p-2 font-semibold transition-colors hover:bg-gray-100',
                  { 'border-indigo-500 bg-indigo-500 hover:!bg-indigo-500': selected },
                  { [labelFocusStyle]: option.value === focusedValue },
                )}
              >
                <span
                  className={clsx(
                    'relative inline-block h-4 w-4 rounded-full border border-black/30 bg-white align-text-bottom',
                    { 'border-indigo-500': selected },
                  )}
                >
                  {selected && (
                    <span className='absolute inset-0 m-0.5 rounded-full bg-indigo-300' />
                  )}
                </span>

                <span className={clsx('ml-1', { 'text-white': selected })}>{option.label}</span>
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}

export default RadioGroup
