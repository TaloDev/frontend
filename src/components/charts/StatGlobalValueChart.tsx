import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { ChartCard } from './ChartCard'
import { ChartCardTooltip } from './ChartCardTooltip'
import { useStatGlobalValueChart } from '../../api/useStatGlobalValueChart'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTick from './ChartTick'
import { format } from 'date-fns'
import clsx from 'clsx'

type StatGlobalValueChartProps = {
  internalName: string
  startDate: string
  endDate: string
}

export function StatGlobalValueChart({ internalName, startDate, endDate }: StatGlobalValueChartProps) {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { dataPoints, loading, error } = useStatGlobalValueChart(
    activeGame,
    internalName,
    startDate,
    endDate
  )

  return (
    <ChartCard
      title='Global value'
      hasData={dataPoints.length > 0}
      loading={loading}
      error={error}
      emptyMessage='There is no global value data for this date range'
    >
      <LineChart data={dataPoints} margin={{ bottom: 20, left: 10, top: 10 }}>
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
          content={(
            <ChartCardTooltip<typeof dataPoints[number]>
              formatter={(payload) => {
                return (
                  <div className='text-black grid grid-cols-[1fr_0.5fr] items-center mt-4'>
                    <div className='font-mono text-sm font-medium'>
                      {payload.value.toLocaleString()}
                    </div>

                    <div
                      className={clsx(
                        'ml-2 text-xs text-center p-1 rounded',
                        {
                          'bg-red-100/50 text-red-600': payload.change < 0,
                          'bg-green-100/50 text-green-600': payload.change > 0,
                          'bg-gray-100 text-gray-600': payload.change === 0
                        }
                      )}
                    >
                      {(payload.change * 100).toFixed(1)}%
                    </div>
                  </div>
                )
              }}
            />
          )}
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
