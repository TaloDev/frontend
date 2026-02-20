import { get } from 'lodash-es'
import { ReactElement } from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTick from './ChartTick'
import { format } from 'date-fns'
import { TaloError } from '../ErrorMessage'
import { TimePeriod } from '../../utils/useTimePeriod'
import { LabelledTimePeriod } from '../TimePeriodPicker'
import { DataKey } from 'recharts/types/util/types'
import { ChartCard } from './ChartCard'
import { useYAxis } from './useYAxis'

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
  const { yAxisProps } = useYAxis({
    data,
    transformer: (d) => {
      return d.flatMap((item) =>
        bars.map((bar) => {
          if (typeof bar.dataKey === 'function') {
            return bar.dataKey(item)
          }
          const value = get(item, String(bar.dataKey))
          return typeof value === 'number' ? value : 0
        })
      )
    }
  })

  return (
    <ChartCard
      title={title}
      loading={loading}
      error={error}
      timePeriod={timePeriod}
      onTimePeriodChange={onTimePeriodChange}
      height={height}
      hasData={data.length > 0}
    >
      <BarChart data={data} margin={{ top: 8, left: 16, bottom: 20, right: 8 }}>
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

        <YAxis {...yAxisProps} />

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
