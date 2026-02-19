import { ReactElement } from 'react'
import { ResponsiveContainer } from 'recharts'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import TimePeriodPicker from '../TimePeriodPicker'
import { timePeriods } from '../../utils/useTimePeriodAndDates'
import { TimePeriod } from '../../utils/useTimePeriod'
import { LabelledTimePeriod } from '../TimePeriodPicker'

type ChartCardProps = {
  title: string
  hasData: boolean
  loading: boolean
  error: TaloError | null
  emptyMessage: string
  timePeriod?: TimePeriod | null
  onTimePeriodChange?: (period: LabelledTimePeriod) => void
  height?: number
  children: ReactElement
}

export function ChartCard({
  title,
  hasData,
  loading,
  error,
  emptyMessage,
  timePeriod,
  onTimePeriodChange,
  height = 300,
  children
}: ChartCardProps) {
  return (
    <div className='hidden md:block border-2 border-gray-700 rounded bg-black space-y-8 p-4'>
      <div className='flex items-start justify-between'>
        <h2 className='text-xl'>{title}</h2>
        {onTimePeriodChange &&
          <TimePeriodPicker
            periods={timePeriods}
            onPick={onTimePeriodChange}
            selectedPeriod={timePeriod ?? null}
          />
        }
      </div>

      {error?.hasKeys === false && <ErrorMessage error={error} />}

      {!loading && !hasData &&
        <p>{emptyMessage}</p>
      }

      {hasData &&
        <ResponsiveContainer height={height}>
          {children}
        </ResponsiveContainer>
      }
    </div>
  )
}
