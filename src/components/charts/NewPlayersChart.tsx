import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import useTimePeriodAndDates from '../../utils/useTimePeriodAndDates'
import { BarChartCard } from './BarChartCard'
import { ChartCardTooltip } from './ChartCardTooltip'
import { useNewPlayersChart } from '../../api/useNewPlayersChart'
import clsx from 'clsx'

const bars = [{ dataKey: 'count', fill: '#6366f1' }]

export function NewPlayersChart() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const {
    timePeriod,
    setTimePeriod,
    debouncedStartDate,
    debouncedEndDate
  } = useTimePeriodAndDates('newPlayersChart')

  const { players: chartData, loading, error } = useNewPlayersChart(activeGame, debouncedStartDate, debouncedEndDate)

  return (
    <BarChartCard
      title='New players'
      data={chartData}
      bars={bars}
      loading={loading}
      error={error}
      timePeriod={timePeriod}
      onTimePeriodChange={(period) => setTimePeriod(period.id)}
      tooltip={(
        <ChartCardTooltip<typeof chartData[number]>
          formatter={(payload) => {
            const count = payload.count
            const change = payload.change

            return (
              <ul className='text-black grid grid-cols-[1fr_0.5fr] mt-4'>
                <li className='flex items-center justify-end font-mono text-sm font-medium'>
                  {count.toLocaleString()} {count === 1 ? 'player' : 'players'}
                </li>

                <li
                  className={clsx(
                    'ml-2 text-xs text-center p-1 rounded',
                    {
                      'bg-red-100/50 text-red-600': change < 0,
                      'bg-green-100/50 text-green-600': change > 0,
                      'bg-gray-100 text-gray-600': change === 0
                    }
                  )}
                >
                  {(change * 100).toFixed(1)}%
                </li>
              </ul>
            )
          }}
        />
      )}
    />
  )
}
