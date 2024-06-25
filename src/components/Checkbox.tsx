import clsx from 'clsx'
import { IconCheck } from '@tabler/icons-react'
import { focusStyle } from '../styles/theme'
import type { ReactNode, Ref } from 'react'

type CheckboxProps = {
  id: string
  checked: boolean | undefined
  onChange: (checked: boolean) => void
  labelContent: ReactNode
  inputRef?: Ref<HTMLInputElement>
}

export default function Checkbox({
  id,
  checked,
  onChange,
  labelContent,
  inputRef
}: CheckboxProps) {
  return (
    <div>
      <span className='relative'>
        <input
          id={id}
          ref={inputRef}
          className={clsx(focusStyle, 'peer appearance-none align-text-top h-[20px] w-[20px] rounded-sm border border-gray-500 checked:border-indigo-400 bg-gray-600 checked:bg-indigo-500')}
          type='checkbox'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <IconCheck size={16} stroke={3} className='hidden peer-checked:inline absolute left-[1.5px] top-[2px] pointer-events-none' />
      </span>


      <label htmlFor={id} className='ml-2'>{labelContent}</label>
    </div>
  )
}
