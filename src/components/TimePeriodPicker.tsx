import { TimePeriod } from '../utils/useTimePeriod'
import ButtonGroup, { ButtonGroupOption } from './ButtonGroup'

export type LabelledTimePeriod = ButtonGroupOption<TimePeriod>

type TimePeriodPickerProps = {
  periods: LabelledTimePeriod[]
  onPick: (period: LabelledTimePeriod) => void
  selectedPeriod: TimePeriod | null
}

export default function TimePeriodPicker({ periods, onPick, selectedPeriod }: TimePeriodPickerProps) {
  return (
    <ButtonGroup
      options={periods}
      selected={selectedPeriod}
      onChange={(id) => {
        const period = periods.find((p) => p.id === id)
        if (period) {
          onPick(period)
        }
      }}
    />
  )
}
