import clsx from 'clsx'
import { format } from 'date-fns'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { useRecoilValue } from 'recoil'
import { useStatGlobalValueChart } from '../../api/useStatGlobalValueChart'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { ChartCard } from './ChartCard'
import { ChartCardTooltip } from './ChartCardTooltip'
import ChartTick from './ChartTick'
import { useYAxis } from './useYAxis'

type StatGlobalValueChartProps = {
  internalName: string
  startDate: string
  endDate: string
}

export function StatGlobalValueChart({
  internalName,
  startDate,
  endDate,
}: StatGlobalValueChartProps) {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { dataPoints, loading, error } = useStatGlobalValueChart(
    activeGame,
    internalName,
    startDate,
    endDate,
  )

  const { yAxisProps } = useYAxis({
    data: dataPoints,
    transformer: (d) => d.map((point) => point.value),
  })

  return (
    <ChartCard title='Global value' loading={loading} error={error}>
      <LineChart data={dataPoints} margin={{ top: 8, left: 16, bottom: 20, right: 8 }}>
        <CartesianGrid strokeDasharray='4' stroke='#444' vertical={false} />

        <XAxis
          dataKey='date'
          type='category'
          tick={
            <ChartTick
              transform={(x, y) => `translate(${x},${y}) rotate(-15)`}
              formatter={(tick) => format(new Date(tick), 'd MMM')}
            />
          }
        />

        <YAxis {...yAxisProps} />

        <Tooltip
          content={
            <ChartCardTooltip<(typeof dataPoints)[number]>
              formatter={(payload) => {
                return (
                  <div className='mt-4 grid grid-cols-[1fr_0.5fr] items-center text-black'>
                    <div className='font-mono text-sm font-medium'>
                      {payload.value.toLocaleString()}
                    </div>

                    <div
                      className={clsx('ml-2 rounded p-1 text-center text-xs', {
                        'bg-red-100/50 text-red-600': payload.change < 0,
                        'bg-green-100/50 text-green-600': payload.change > 0,
                        'bg-gray-100 text-gray-600': payload.change === 0,
                      })}
                    >
                      {(payload.change * 100).toFixed(1)}%
                    </div>
                  </div>
                )
              }}
            />
          }
        />

        <Line
          dataKey='value'
          stroke='#6366f1'
          activeDot={{ r: 6 }}
          type='linear'
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ChartCard>
  )
}
