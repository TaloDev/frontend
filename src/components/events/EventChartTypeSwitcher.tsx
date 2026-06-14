import type { ReactNode } from 'react'
import { IconChartLine, IconChartPie } from '@tabler/icons-react'
import clsx from 'clsx'
import Button from '../Button'

export type ChartMode = 'line' | 'pie'

type Props = {
  value: ChartMode
  onChange: (mode: ChartMode) => void
}

const options: {
  mode: ChartMode
  label: string
  icon: ReactNode
}[] = [
  { mode: 'line', label: 'Line', icon: <IconChartLine size={20} /> },
  { mode: 'pie', label: 'Pie', icon: <IconChartPie size={20} /> },
]

export function EventChartTypeSwitcher({ value, onChange }: Props) {
  return (
    <div className='mb-4 flex items-center gap-2'>
      {options.map(({ mode, label, icon }) => (
        <Button
          key={mode}
          type='button'
          variant='bare'
          icon={icon}
          onClick={() => onChange(mode)}
          extra={{ 'aria-pressed': value === mode }}
          className={clsx(
            'min-w-20 rounded-md px-3 py-2 text-center! text-sm font-medium text-black',
            { 'bg-indigo-500 text-white': value === mode },
            { 'bg-white hover:bg-gray-200': value !== mode },
          )}
        >
          <span>{label}</span>
        </Button>
      ))}
    </div>
  )
}
