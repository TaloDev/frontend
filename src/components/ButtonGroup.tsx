import clsx from 'clsx'
import Button from './Button'

export type ButtonGroupOption<T> = {
  id: T
  label: string
}

type ButtonGroupProps<T> = {
  options: ButtonGroupOption<T>[]
  selected: T | null
  onChange: (value: T) => void
}

export default function ButtonGroup<T extends string>({
  options,
  selected,
  onChange,
}: ButtonGroupProps<T>) {
  const buttonClassName =
    'text-sm md:text-base border-2 border-l-0 py-1 px-1 md:py-1.5 md:px-2 border-indigo-500 rounded-none first:rounded-l first:border-l-2 last:rounded-r hover:bg-gray-900 ring-inset'

  return (
    <div>
      {options.map((option) => (
        <Button
          type='button'
          key={option.id}
          variant='bare'
          className={clsx(buttonClassName, {
            'bg-indigo-500 hover:bg-indigo-500': option.id === selected,
          })}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
