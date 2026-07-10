import Tippy from '@tippyjs/react'
import { format, isValid } from 'date-fns'
import { useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { formatLocalDate, parseLocalDate } from '../utils/localDate'
import TextInput from './TextInput'

type DateInputProps = {
  id: string
  value: string
  onDateChange?: (val: Date) => void
  onDateTimeStringChange?: (val: string) => void
  textInputProps?: Partial<React.ComponentProps<typeof TextInput>>
}

export default function DateInput({
  id,
  value,
  onDateChange,
  onDateTimeStringChange,
  textInputProps,
}: DateInputProps) {
  const [isOpen, setOpen] = useState(false)

  const date = useMemo(() => {
    if (!value) {
      return new Date()
    }

    const parsed = parseLocalDate(value)
    return isValid(parsed) ? parsed : new Date()
  }, [value])

  return (
    <div>
      <Tippy
        placement='bottom-start'
        offset={[0, 8]}
        interactive={true}
        arrow={false}
        theme='bare'
        content={
          <DayPicker
            mode='single'
            selected={date}
            onSelect={(selectedDate) => {
              const newDate = selectedDate ?? new Date()
              onDateChange?.(newDate)
              onDateTimeStringChange?.(formatLocalDate(newDate))

              setOpen(false)
            }}
            defaultMonth={date}
          />
        }
        visible={isOpen}
        onClickOutside={/* v8ignore next */ () => setOpen(false)}
      >
        <div>
          <TextInput
            id={id}
            variant='modal'
            value={format(date, 'dd MMM yyyy')}
            inputExtra={{
              onFocus: () => setOpen(true),
              name: id,
            }}
            inputClassName='caret-transparent cursor-pointer'
            {...textInputProps}
          />
        </div>
      </Tippy>
    </div>
  )
}
