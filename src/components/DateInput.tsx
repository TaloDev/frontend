import { useCallback, useMemo, useState } from 'react'
import TextInput from './TextInput'
import Tippy from '@tippyjs/react'
import { DayPicker } from 'react-day-picker'
import { addHours, format, isValid } from 'date-fns'

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
  textInputProps
}: DateInputProps) {
  const [isOpen, setOpen] = useState(false)

  const date = useMemo(() => {
    return isValid(new Date(value)) ? new Date(value) : new Date()
  }, [value])

  const getDateTimeStringForValue = useCallback((value: Date): string => {
    return addHours(value, (value.getTimezoneOffset() / 60) * -1).toISOString()
  }, [])

  return (
    <div>
      <Tippy
        placement='bottom-start'
        offset={[0, 8]}
        interactive={true}
        arrow={false}
        theme='bare'
        content={(
          <DayPicker
            mode='single'
            selected={date}
            onSelect={(selectedDate) => {
              const newDate = selectedDate ?? new Date()
              onDateChange?.(newDate)
              onDateTimeStringChange?.(getDateTimeStringForValue(newDate))

              setOpen(false)
            }}
            defaultMonth={date}
          />
        )}
        visible={isOpen}
        onClickOutside={/* v8ignore next */ () => setOpen(false)}
      >
        <div>
          <TextInput
            id={id}
            variant='modal'
            value={format(date, 'dd MMM Y')}
            inputExtra={{
              onFocus: () => setOpen(true),
              name: id
            }}
            inputClassName='caret-transparent cursor-pointer'
            {...textInputProps}
          />
        </div>
      </Tippy>
    </div>
  )
}
