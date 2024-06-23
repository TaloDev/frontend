import { useState, useEffect } from 'react'
import TextInput from './TextInput'
import Tippy from '@tippyjs/react'
import { DayPicker } from 'react-day-picker'
import { format, isValid } from 'date-fns'

type DateInputProps = {
  id: string
  value: string
  onChange: (val: string) => void
}

export default function DateInput({
  id,
  value,
  onChange
}: DateInputProps) {
  const [date, setDate] = useState(isValid(new Date(value)) ? new Date(value) : new Date())
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    onChange(date.toISOString())
    setTimeout(() => {
      setOpen(false)
    }, 100)
  }, [date])

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
            onSelect={(date) => setDate(date ?? new Date())}
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
            containerClassName='w-28'
            value={format(date, 'dd MMM Y')}
            inputExtra={{
              onFocus: () => setOpen(true),
              name: id
            }}
          />
        </div>
      </Tippy>
    </div>
  )
}
