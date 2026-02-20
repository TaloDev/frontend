import type { ReactNode, Ref } from 'react'
import { IconCheck } from '@tabler/icons-react'
import clsx from 'clsx'
import { focusStyle } from '../styles/theme'

type CheckboxProps = {
  id: string
  checked: boolean | undefined
  onChange: (checked: boolean) => void
  labelContent: ReactNode
  inputRef?: Ref<HTMLInputElement>
}

export default function Checkbox({ id, checked, onChange, labelContent, inputRef }: CheckboxProps) {
  return (
    <div>
      <span className='relative'>
        <input
          id={id}
          ref={inputRef}
          className={clsx(
            focusStyle,
            'peer h-[20px] w-[20px] appearance-none rounded-sm border border-gray-500 bg-gray-600 align-text-top checked:border-indigo-400 checked:bg-indigo-500',
          )}
          type='checkbox'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <IconCheck
          size={16}
          stroke={3}
          className='pointer-events-none absolute top-[2px] left-[1.5px] hidden peer-checked:inline'
        />
      </span>

      <label htmlFor={id} className='ml-2'>
        {labelContent}
      </label>
    </div>
  )
}
