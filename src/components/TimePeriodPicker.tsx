import { TimePeriod } from '../utils/useTimePeriod'
import Button from './Button'
import clsx from 'clsx'

export type LabelledTimePeriod = {
  id: TimePeriod
  label: string
}

type TimePeriodPickerProps = {
  periods: LabelledTimePeriod[]
  onPick: (period: LabelledTimePeriod) => void
  selectedPeriod: TimePeriod | null
}

export default function TimePeriodPicker({ periods, onPick, selectedPeriod }: TimePeriodPickerProps) {
  const buttonClassName = 'text-sm md:text-base border-2 border-l-0 py-1 px-1 md:py-1.5 md:px-2 border-indigo-500 rounded-none first:rounded-l first:border-l-2 last:rounded-r hover:bg-gray-900 ring-inset'

  return (
    <div>
      {periods.map((period) => (
        <Button
          key={period.id}
          variant='bare'
          className={clsx(buttonClassName, { 'bg-indigo-500 hover:bg-indigo-500': period.id === selectedPeriod })}
          onClick={() => onPick(period)}
        >
          {period.label}
        </Button>
      ))}
    </div>
  )
}
