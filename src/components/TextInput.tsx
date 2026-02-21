import { IconAlertCircle } from '@tabler/icons-react'
import clsx from 'clsx'
import { InputHTMLAttributes, useState, ChangeEvent } from 'react'
import { focusStyle } from '../styles/theme'

export type TextInputVariant = 'light' | 'modal'

type TextInputProps = {
  id: string
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  value?: string
  label?: string
  placeholder?: string
  type?: string
  inputType?: 'textarea' | 'input'
  variant?: TextInputVariant
  inputClassName?: string
  disabled?: boolean
  errors?: (string | undefined)[]
  containerClassName?: string
  inputExtra?: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>
  startFocused?: boolean
}

export default function TextInput({
  id,
  onChange,
  value,
  label,
  placeholder = '',
  type = 'text',
  inputType = 'input',
  variant,
  inputClassName,
  disabled,
  errors,
  containerClassName,
  inputExtra = {},
}: TextInputProps) {
  const [hasFocus, setHasFocus] = useState(false)

  const errorsToShow = errors?.filter(Boolean) ?? []
  const showErrorHighlight = !hasFocus && errorsToShow.length > 0

  const finalClassName = clsx(`
    block
    w-full
    rounded
    p-2
    disabled:bg-gray-300
    disabled:text-gray-700
    ${focusStyle}
    ${inputClassName ?? ''}
  `, {
    'bg-gray-600': !variant,
    'bg-gray-100 text-black': variant === 'light',
    'border border-black/30 bg-white focus:border-black/0': variant === 'modal',
  })

  const Element = inputType === 'textarea' ? 'textarea' : 'input'

  return (
    <div>
      <div className={clsx('inline-block w-full', containerClassName)}>
        {label && (
          <label htmlFor={id} className='mb-2 flex items-end justify-between font-semibold'>
            {label}
            {errorsToShow.length > 0 && (
              <IconAlertCircle className='-mt-0.5 inline text-red-500' size={20} />
            )}
          </label>
        )}

        <div className='relative'>
          <Element
            id={id}
            className={finalClassName}
            {...(inputType === 'input' ? { type } : {})}
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
          {showErrorHighlight && (
            <div className='absolute right-0 bottom-0 left-0 h-1 rounded-br rounded-bl bg-red-500' />
          )}
        </div>
      </div>

      {errorsToShow.map((error, idx) => (
        <p role='alert' key={idx} className='mt-2 font-medium text-red-500'>
          {error}
        </p>
      ))}
    </div>
  )
}
