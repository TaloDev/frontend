import ButtonGroup, { ButtonGroupOption } from '../ButtonGroup'

export type SaveMode = 'tree' | 'linear'

type SaveModePickerProps = {
  selectedMode: SaveMode
  onModeChange: (mode: SaveMode) => void
}

const modes: ButtonGroupOption<SaveMode>[] = [
  { id: 'linear', label: 'Linear mode' },
  { id: 'tree', label: 'Tree mode' }
]

export default function SaveModePicker({ selectedMode, onModeChange }: SaveModePickerProps) {
  return (
    <ButtonGroup
      options={modes}
      selected={selectedMode}
      onChange={onModeChange}
    />
  )
}
