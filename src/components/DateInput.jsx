import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TextInput from './TextInput'
import Tippy from '@tippyjs/react'
import { DayPicker } from 'react-day-picker'
import { format, isValid } from 'date-fns'

export default function DateInput({ id, value, onChange }) {
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
            onSelect={setDate}
          />
        )}
        visible={isOpen}
        onClickOutside={/* c8 ignore next */ () => setOpen(false)}
      >
        <div>
          <TextInput
            id={id}
            variant='modal'
            containerClassName='w-28'
            value={format(date, 'dd MMM Y')}
            inputExtra={{
              onFocus: () => setOpen(true)
            }}
          />
        </div>
      </Tippy>
    </div>
  )
}

DateInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
