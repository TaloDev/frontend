import { ReactElement } from 'react'
import { ResponsiveContainer } from 'recharts'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import TimePeriodPicker from '../TimePeriodPicker'
import { timePeriods } from '../../utils/useTimePeriodAndDates'
import { TimePeriod } from '../../utils/useTimePeriod'
import { LabelledTimePeriod } from '../TimePeriodPicker'
import Loading from '../Loading'

type ChartCardProps = {
  title: string
  loading: boolean
  error: TaloError | null
  timePeriod?: TimePeriod | null
  onTimePeriodChange?: (period: LabelledTimePeriod) => void
  height?: number
  children: ReactElement
}

export function ChartCard({
  title,
  loading,
  error,
  timePeriod,
  onTimePeriodChange,
  height = 300,
  children
}: ChartCardProps) {
  return (
    <div className='hidden md:block border-2 border-gray-700 rounded bg-black space-y-8 p-4'>
      <div className='flex items-start justify-between'>
        <div className='flex gap-4'>
          <h2 className='text-xl'>{title}</h2>
          {loading &&
            <div className='mt-1'>
              <Loading size={24} thickness={180} />
            </div>
          }
        </div>
        {onTimePeriodChange &&
          <TimePeriodPicker
            periods={timePeriods}
            onPick={onTimePeriodChange}
            selectedPeriod={timePeriod ?? null}
          />
        }
      </div>

      {error?.hasKeys === false && <ErrorMessage error={error} />}

      {!loading &&
        <ResponsiveContainer height={height}>
          {children}
        </ResponsiveContainer>
      }
    </div>
  )
}
