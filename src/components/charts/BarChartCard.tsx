import { ReactElement } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTick from './ChartTick'
import { format } from 'date-fns'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import TimePeriodPicker from '../TimePeriodPicker'
import { timePeriods } from '../../utils/useTimePeriodAndDates'
import { TimePeriod } from '../../utils/useTimePeriod'
import { LabelledTimePeriod } from '../TimePeriodPicker'

export type BarChartCardBar = {
  dataKey: string
  fill: string
  stackId?: string
}

type BarChartCardProps = {
  title: string
  data: { date: number, [key: string]: number }[]
  bars: BarChartCardBar[]
  loading: boolean
  error: TaloError | null
  emptyMessage: string
  timePeriod: TimePeriod | null
  onTimePeriodChange: (period: LabelledTimePeriod) => void
  height?: number
  tooltip: ReactElement
}

export function BarChartCard({
  title,
  data,
  bars,
  loading,
  error,
  emptyMessage,
  timePeriod,
  onTimePeriodChange,
  height = 300,
  tooltip
}: BarChartCardProps) {
  return (
    <div className='hidden md:block border-2 border-gray-700 rounded bg-black space-y-8 p-4'>
      <div className='flex items-start justify-between'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <TimePeriodPicker
          periods={timePeriods}
          onPick={onTimePeriodChange}
          selectedPeriod={timePeriod}
        />
      </div>

      {error?.hasKeys === false && <ErrorMessage error={error} />}

      {!loading && data.length === 0 &&
        <p>{emptyMessage}</p>
      }

      {data.length > 0 &&
        <ResponsiveContainer height={height}>
          <BarChart data={data} margin={{ bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray='4' stroke='#444' vertical={false} />

            <XAxis
              dataKey='date'
              type='category'
              tick={(
                <ChartTick
                  transform={(x, y) => `translate(${x},${y}) rotate(-30)`}
                  formatter={(tick) => format(new Date(tick), 'd MMM')}
                />
              )}
            />

            <YAxis
              allowDecimals={false}
              tick={(
                <ChartTick
                  transform={(x, y) => `translate(${x! - 4},${y! - 12})`}
                  formatter={(tick) => tick}
                />
              )}
            />

            <Tooltip
              content={tooltip}
              cursor={{ fill: '#444', opacity: 0.4 }}
            />

            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill}
                stackId={bar.stackId}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      }
    </div>
  )
}
