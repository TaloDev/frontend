import { IconAdjustmentsHorizontal } from '@tabler/icons-react'
import Button from '../Button'
import CheckboxButton from '../CheckboxButton'
import LinkButton from '../LinkButton'
import TextInput from '../TextInput'
import Tippy from '@tippyjs/react'
import { useCallback, useMemo, useState } from 'react'
import { useEventsContext } from './EventsContext'

type EventsFilterProps = {
  initialShow?: boolean
  eventNames: string[]
}

export default function EventsFilter({ eventNames, initialShow = false }: EventsFilterProps) {
  const { selectedEventNames, setSelectedEventNames } = useEventsContext()

  const [show, setShow] = useState(initialShow)
  const [eventNamefilter, setEventNameFilter] = useState('')

  const onCheckEventName = useCallback((checked: boolean, name: string) => {
    if (checked) {
      setSelectedEventNames([...selectedEventNames, name])
    } else {
      setSelectedEventNames(selectedEventNames.filter((selected) => selected !== name))
    }
  }, [selectedEventNames, setSelectedEventNames])

  const filteredEventNames = useMemo(() => {
    return eventNames.filter((name) => {
      if (!eventNamefilter) return true
      return name.toLowerCase().includes(eventNamefilter.toLowerCase())
    })
  }, [eventNames, eventNamefilter])

  return (
    <div className='w-40'>
      <Tippy
        placement='bottom-start'
        offset={[0, 8]}
        interactive={true}
        arrow={false}
        theme='bare'
        content={(
          <div className='rdp !p-0 min-w-[400px] space-y-2'>
            <div className='p-2 space-y-2'>
              <h2 className='font-semibold text-lg'>{filteredEventNames.length} events</h2>
              <TextInput
                id='event-name-filter'
                variant='modal'
                type='search'
                placeholder='Search'
                onChange={setEventNameFilter}
                value={eventNamefilter}
              />
            </div>

            <hr />

            <ul className='p-2 h-[200px] overflow-y-scroll !mt-0'>
              {filteredEventNames.sort((a, b) => a.localeCompare(b)).map((name) => (
                <li key={name}>
                  <CheckboxButton
                    id={`${name}-checkbox`}
                    checked={Boolean(selectedEventNames.find((selected) => selected === name))}
                    onChange={(checked) => onCheckEventName(checked, name)}
                    label={name}
                  />
                </li>
              ))}
              {filteredEventNames.length === 0 && <li>No events found</li>}
            </ul>

            <hr className='!mt-0' />

            <div className='px-2 pb-2 flex items-center justify-between'>
              <LinkButton onClick={() => setSelectedEventNames((curr) => [...new Set([...curr, ...filteredEventNames])])}>
                Select all
              </LinkButton>
              <LinkButton onClick={() => setSelectedEventNames([])}>
                Clear
              </LinkButton>
            </div>
          </div>
        )}
        visible={show}
        onClickOutside={() => setShow(false)}
      >
        <div>
          <Button type='button' icon={<IconAdjustmentsHorizontal />} onClick={() => setShow(!show)}>
            <span>Events ({selectedEventNames.length})</span>
          </Button>
        </div>
      </Tippy>
    </div>
  )
}
