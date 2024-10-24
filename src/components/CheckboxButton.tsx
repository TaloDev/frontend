import { useState } from 'react'
import clsx from 'clsx'
import { IconCheck } from '@tabler/icons-react'
import { hiddenInputStyle, labelFocusStyle } from '../styles/theme'

type CheckboxButtonProps = {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export default function CheckboxButton({ id, checked, label, onChange }: CheckboxButtonProps) {
  const [focus, setFocus] = useState(false)

  return (
    <>
      <input
        id={id}
        type='checkbox'
        className={hiddenInputStyle}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={() => onChange(!checked)}
      />

      <label
        htmlFor={id}
        className={clsx('p-1 rounded hover:bg-gray-200 flex items-center space-x-2 cursor-pointer transition-all', { [labelFocusStyle]: focus })}
      >
        <span className='inline-block rounded w-6 h-6 bg-white border border-black/30 align-text-bottom text-black active:bg-gray-200 transition-colors'>
          {checked &&
            <span className='flex items-center justify-center h-full'>
              <IconCheck size={16} stroke={3} />
            </span>
          }
        </span>
        <span>{label}</span>
      </label>
    </>
  )
}
