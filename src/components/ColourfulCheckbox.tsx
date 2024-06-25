import { ChangeEvent, useState } from 'react'
import clsx from 'clsx'
import { IconCheck } from '@tabler/icons-react'
import { hiddenInputStyle, labelFocusStyle } from '../styles/theme'

type ColourfulCheckboxProps = {
  id: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  colour: string
  label: string
}

export default function ColourfulCheckbox({ id, ...props }: ColourfulCheckboxProps) {
  const [focus, setFocus] = useState(false)

  return (
    <>
      <input
        id={id}
        type='checkbox'
        className={hiddenInputStyle}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...props}
      />

      <label
        htmlFor={id}
        className={clsx('px-2 py-1 rounded block mb-2 bg-gray-900 border-r-8 cursor-pointer hover:bg-gray-800 transition-all', { [labelFocusStyle]: focus })}
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
