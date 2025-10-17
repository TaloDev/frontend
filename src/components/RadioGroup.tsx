import { useState } from 'react'
import clsx from 'clsx'
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

function RadioGroup<T>({
  label,
  name,
  options,
  onChange,
  value,
  info
}: RadioGroupProps<T>) {
  const [focusedValue, setFocusedValue] = useState<T | null>(null)

  return (
    <fieldset className='w-full'>
      {label && <legend className='font-semibold mb-1'>{label}</legend>}
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
                  'block font-semibold border border-black/30 p-2 rounded cursor-pointer transition-colors hover:bg-gray-100',
                  { 'bg-indigo-500 hover:!bg-indigo-500 border-indigo-500': selected },
                  { [labelFocusStyle]: option.value === focusedValue }
                )}
              >
                <span className={clsx('inline-block relative rounded-full w-4 h-4 bg-white align-text-bottom border border-black/30', { 'border-indigo-500': selected })}>
                  {selected &&
                    <span className='absolute inset-0 rounded-full bg-indigo-300 m-0.5' />
                  }
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
