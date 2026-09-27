import { addHours, format, isValid } from 'date-fns'
import { useAtomValue } from 'jotai'
import { useContext, useMemo, useState } from 'react'
import { KeyedMutator } from 'swr'
import { createScheduledGameConfigChanges } from '../api/createScheduledGameConfigChanges'
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import DateInput from '../components/DateInput'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { ScheduledGameConfigChange } from '../entities/scheduledGameConfigChange'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'
import { formatLocalDate } from '../utils/localDate'

type ScheduleConfigChangeProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<{ changes: ScheduledGameConfigChange[] }>
}

export default function ScheduleConfigChange({ modalState, mutate }: ScheduleConfigChangeProps) {
  const [, setOpen] = modalState
  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame
  const toast = useContext(ToastContext)

  const defaultApplyAt = useMemo(() => addHours(new Date(), 1), [])

  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [deleteProp, setDeleteProp] = useState(false)
  const [date, setDate] = useState(formatLocalDate(defaultApplyAt))
  const [time, setTime] = useState(format(defaultApplyAt, 'HH:mm'))
  const [error, setError] = useState<TaloError | null>(null)
  const [isScheduling, setScheduling] = useState(false)

  // combine the picker date + time input, interpreted in the viewer's timezone
  const applyAt = useMemo(() => {
    const parsed = new Date(`${date}T${time}:00`)
    return isValid(parsed) ? parsed : null
  }, [date, time])

  const canSchedule = () => {
    return key.trim().length > 0 && applyAt !== null && applyAt > new Date()
  }

  const onDeletePropChange = (checked: boolean) => {
    setDeleteProp(checked)
    if (checked) {
      setValue('')
    }
  }

  const onSchedule = async () => {
    if (!canSchedule() || applyAt === null) {
      return
    }

    setScheduling(true)
    setError(null)

    try {
      await createScheduledGameConfigChanges(activeGame.id, [
        { key: key.trim(), value: deleteProp ? null : value, applyAt: applyAt.toISOString() },
      ])
      await mutate()
      toast.trigger('Change scheduled', ToastType.SUCCESS)
      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setScheduling(false)
    }
  }

  return (
    <Modal
      id='schedule-config-change'
      title='Schedule config change'
      modalState={modalState}
      footer={
        <div className='flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='w-full md:w-32'>
            <Button
              type='button'
              disabled={!canSchedule()}
              isLoading={isScheduling}
              onClick={onSchedule}
            >
              Schedule
            </Button>
          </div>
          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className='space-y-4 p-4'>
        <TextInput
          id='schedule-key'
          variant='modal'
          label='Key'
          placeholder='e.g. currentEvent'
          onChange={setKey}
          value={key}
        />

        <Checkbox
          id='schedule-delete'
          variant='modal'
          checked={deleteProp}
          onChange={onDeletePropChange}
          labelContent='Delete this prop when applied'
        />

        <TextInput
          id='schedule-value'
          variant='modal'
          label='Value'
          placeholder={
            deleteProp ? 'This prop will be deleted when applied' : 'The value to set when applied'
          }
          disabled={deleteProp}
          onChange={setValue}
          value={value}
        />

        <div className='flex items-end space-x-4'>
          <DateInput
            id='schedule-date'
            value={date}
            onDateTimeStringChange={setDate}
            textInputProps={{ label: 'Apply on' }}
          />

          <TextInput
            id='schedule-time'
            type='time'
            variant='modal'
            label='Apply at'
            containerClassName='max-w-[140px]'
            onChange={setTime}
            value={time}
          />
        </div>

        {applyAt !== null && applyAt <= new Date() && (
          <p role='alert' className='font-medium text-red-500'>
            The apply time must be in the future
          </p>
        )}

        {error && <ErrorMessage error={error} />}
      </div>
    </Modal>
  )
}
