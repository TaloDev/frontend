import { ReactElement } from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTick from './ChartTick'
import { format } from 'date-fns'
import { TaloError } from '../ErrorMessage'
import { TimePeriod } from '../../utils/useTimePeriod'
import { LabelledTimePeriod } from '../TimePeriodPicker'
import { DataKey } from 'recharts/types/util/types'
import { ChartCard } from './ChartCard'

export type BarChartCardBar<T> = {
  dataKey: DataKey<T>
  fill: string
  stackId?: string
}

type BarChartCardProps<T> = {
  title: string
  data: T[]
  bars: BarChartCardBar<T>[]
  loading: boolean
  error: TaloError | null
  timePeriod: TimePeriod | null
  onTimePeriodChange: (period: LabelledTimePeriod) => void
  height?: number
  tooltip: ReactElement
}

export function BarChartCard<T>({
  title,
  data,
  bars,
  loading,
  error,
  timePeriod,
  onTimePeriodChange,
  height = 300,
  tooltip
}: BarChartCardProps<T>) {
  return (
    <ChartCard
      title={title}
      loading={loading}
      error={error}
      timePeriod={timePeriod}
      onTimePeriodChange={onTimePeriodChange}
      height={height}
    >
      <BarChart data={data} margin={{ bottom: 20, left: 10, top: 10 }}>
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
              formatter={(tick) => tick.toLocaleString()}
            />
          )}
        />

        <Tooltip
          content={tooltip}
          cursor={{ fill: '#444', opacity: 0.4 }}
        />

        {bars.map((bar, idx) => (
          <Bar
            key={idx}
            dataKey={bar.dataKey}
            fill={bar.fill}
            stackId={bar.stackId}
          />
        ))}
      </BarChart>
    </ChartCard>
  )
}
