import { DayPicker } from '@daypicker/react'
import Tippy from '@tippyjs/react'
import { format, isValid } from 'date-fns'
import { useMemo, useState } from 'react'
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
  const [month, setMonth] = useState<Date | undefined>(undefined)

  const date = useMemo(() => {
    if (!value) {
      return new Date()
    }

    const parsed = parseLocalDate(value)
    return isValid(parsed) ? parsed : new Date()
  }, [value])

  const applyDate = (selectedDate?: Date) => {
    const newDate = selectedDate ?? new Date()
    onDateChange?.(newDate)
    onDateTimeStringChange?.(formatLocalDate(newDate))
    setMonth(newDate)
  }

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
            captionLayout='dropdown'
            mode='single'
            selected={date}
            onSelect={applyDate}
            footer={
              <button
                type='button'
                onClick={() => applyDate(new Date())}
                className='text-sm text-indigo-600 hover:text-indigo-800'
              >
                Reset to today
              </button>
            }
            month={month}
            onMonthChange={setMonth}
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
