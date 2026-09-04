import { IconChartFunnel, IconRefresh } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { useDebounce } from 'use-debounce'
import { useEventFunnelPreview } from '../../api/useEventFunnelPreview'
import { EventFunnelStep } from '../../entities/eventFunnel'
import { SelectedActiveGame } from '../../state/activeGameState'
import { timePeriods } from '../../utils/useTimePeriodAndDates'
import Button from '../Button'
import DateInput from '../DateInput'
import ErrorMessage from '../ErrorMessage'
import { useEventsContext } from '../events/EventsContext'
import Loading from '../Loading'
import TimePeriodPicker from '../TimePeriodPicker'
import { FunnelResult } from './FunnelResult'

type EventFunnelPreviewProps = {
  activeGame: SelectedActiveGame
  steps: EventFunnelStep[]
  maxGap: number
  lastUpdatedAt?: number
  onRefresh?: () => Promise<void>
  refreshing?: boolean
}

export function EventFunnelPreview({
  activeGame,
  steps,
  maxGap,
  lastUpdatedAt,
  onRefresh,
  refreshing,
}: EventFunnelPreviewProps) {
  const {
    timePeriod,
    setTimePeriod,
    selectedStartDate,
    selectedEndDate,
    debouncedStartDate,
    debouncedEndDate,
    onStartDateChange,
    onEndDateChange,
  } = useEventsContext()

  const [debouncedSteps] = useDebounce(steps, 300)
  const [debouncedMaxGap] = useDebounce(maxGap, 300)

  const { resultSteps, loading, error, mutate } = useEventFunnelPreview(
    activeGame,
    debouncedSteps,
    debouncedMaxGap,
    debouncedStartDate,
    debouncedEndDate,
  )

  // Only surface a fetch error once the inputs have stopped changing, so
  // editing doesn't leave a stale error banner on screen.
  const inputsSettled =
    steps === debouncedSteps &&
    maxGap === debouncedMaxGap &&
    selectedStartDate === debouncedStartDate &&
    selectedEndDate === debouncedEndDate
  const showError = inputsSettled && error

  const handleRefresh = async () => {
    await onRefresh?.()
    await mutate()
  }

  return (
    <div className='space-y-4 rounded border border-gray-700 bg-gray-900 p-4'>
      <div className='flex justify-between'>
        <TimePeriodPicker
          periods={timePeriods}
          onPick={(period) => setTimePeriod(period.id)}
          selectedPeriod={timePeriod}
        />
        {(loading || refreshing) && resultSteps.length > 0 && <Loading size={24} thickness={180} />}
      </div>

      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div className='flex w-full flex-col gap-4 md:w-2/3 md:flex-row md:items-start'>
          <div className='w-full md:w-1/3'>
            <DateInput
              id='preview-start-date'
              onDateTimeStringChange={onStartDateChange}
              value={selectedStartDate}
              textInputProps={{
                label: 'Start date',
                placeholder: 'Start date',
                variant: undefined,
              }}
            />
          </div>

          <div className='w-full md:w-1/3'>
            <DateInput
              id='preview-end-date'
              onDateTimeStringChange={onEndDateChange}
              value={selectedEndDate}
              textInputProps={{ label: 'End date', placeholder: 'End date', variant: undefined }}
            />
          </div>
        </div>

        {onRefresh && (
          <div className='flex items-center gap-1'>
            <p className='text-sm text-gray-400'>
              Updated {formatDistanceToNow(new Date(lastUpdatedAt ?? Date.now()))} ago
            </p>
            <Button
              variant='icon'
              disabled={refreshing}
              className='rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white'
              onClick={handleRefresh}
              icon={<IconRefresh size={14} />}
              extra={{ 'aria-label': 'Refresh funnel results' }}
            />
          </div>
        )}
      </div>

      <div>
        {showError && <ErrorMessage error={showError} />}

        {resultSteps.length > 0 && (
          <div className='mt-12'>
            <FunnelResult steps={resultSteps} />
          </div>
        )}

        {!showError && resultSteps.length === 0 && loading && (
          <div className='flex justify-center'>
            <Loading size={24} thickness={180} />
          </div>
        )}

        {!showError && resultSteps.length === 0 && !loading && (
          <div className='flex flex-col items-center justify-center gap-4 py-16 text-center'>
            <div className='flex size-16 items-center justify-center rounded-2xl border-2 border-indigo-400 bg-linear-to-b from-gray-800 to-gray-900 text-indigo-400 shadow-md'>
              <IconChartFunnel size={32} />
            </div>
            <p className='text-xl font-medium'>Build your funnel</p>
            <div className='leading-relaxed text-gray-300'>
              Add at least 2 valid steps to see the preview
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
