import { IconCheck } from '@tabler/icons-react'
import clsx from 'clsx'
import { useState } from 'react'
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
        className={clsx(
          'flex cursor-pointer items-center space-x-2 rounded p-1 transition-all hover:bg-gray-200',
          { [labelFocusStyle]: focus },
        )}
      >
        <span className='inline-block h-6 w-6 rounded border border-black/30 bg-white align-text-bottom text-black transition-colors active:bg-gray-200'>
          {checked && (
            <span className='flex h-full items-center justify-center'>
              <IconCheck size={16} stroke={3} />
            </span>
          )}
        </span>
        <span>{label}</span>
      </label>
    </>
  )
}
