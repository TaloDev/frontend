import { ReactElement } from 'react'
import { ResponsiveContainer } from 'recharts'
import { TimePeriod } from '../../utils/useTimePeriod'
import { timePeriods } from '../../utils/useTimePeriodAndDates'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import Loading from '../Loading'
import TimePeriodPicker from '../TimePeriodPicker'
import { LabelledTimePeriod } from '../TimePeriodPicker'

type ChartCardProps = {
  title: string
  loading: boolean
  error: TaloError | null
  timePeriod?: TimePeriod | null
  onTimePeriodChange?: (period: LabelledTimePeriod) => void
  height?: number
  hasData?: boolean
  children: ReactElement
}

export function ChartCard({
  title,
  loading,
  error,
  timePeriod,
  onTimePeriodChange,
  height = 300,
  hasData = true,
  children,
}: ChartCardProps) {
  return (
    <div className='hidden space-y-4 rounded border-2 border-gray-700 bg-black p-4 md:block'>
      <div className='flex items-start justify-between'>
        <div className='flex gap-4'>
          <h2 className='text-xl'>{title}</h2>
          {loading && (
            <div className='mt-1'>
              <Loading size={24} thickness={180} />
            </div>
          )}
        </div>
        {onTimePeriodChange && (
          <TimePeriodPicker
            periods={timePeriods}
            onPick={onTimePeriodChange}
            selectedPeriod={timePeriod ?? null}
          />
        )}
      </div>

      {error?.hasKeys === false && <ErrorMessage error={error} />}

      {!hasData && !loading && <p className='-mt-4'>No data for this date range</p>}

      {hasData && !loading && <ResponsiveContainer height={height}>{children}</ResponsiveContainer>}
    </div>
  )
}
