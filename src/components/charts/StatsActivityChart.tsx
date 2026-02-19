import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import useTimePeriodAndDates from '../../utils/useTimePeriodAndDates'
import { BarChartCard } from './BarChartCard'
import { ChartCardTooltip } from './ChartCardTooltip'
import { useStatsActivityChart } from '../../api/useStatsActivityChart'
import { Fragment } from 'react'
import clsx from 'clsx'
import { getPersistentColor } from '../../utils/getPersistentColour'

export function StatsActivityChart() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const {
    timePeriod,
    setTimePeriod,
    debouncedStartDate,
    debouncedEndDate
  } = useTimePeriodAndDates('statsActivityChart')

  const { stats, statNames, loading, error } = useStatsActivityChart(activeGame, debouncedStartDate, debouncedEndDate)
  const bars = statNames.map((name) => ({
    dataKey: (p: typeof stats[number]) => p.stats[name] ?? null,
    stackId: 'stats',
    fill: getPersistentColor(name)
  }))

  return (
    <BarChartCard
      title='Stats activity'
      data={stats}
      bars={bars}
      loading={loading}
      error={error}
      timePeriod={timePeriod}
      onTimePeriodChange={(period) => setTimePeriod(period.id)}
      tooltip={(
        <ChartCardTooltip<typeof stats[number]>
          formatter={(payload) => {
            return (
              <span className='text-black grid grid-cols-[2fr_1fr_0.5fr] gap-y-2 mt-4'>
                {Object.keys(payload.stats)
                  .sort((keyA, keyB) => (payload.stats[keyB] || payload.change[keyB]) - (payload.stats[keyA] || payload.change[keyA]))
                  .map((key, idx) => (
                    <Fragment key={idx}>
                      <span className='flex items-center text-sm'>
                        <span
                          className='w-4 h-4 rounded inline-block mr-2'
                          style={{ backgroundColor: getPersistentColor(key) }}
                        />
                        {key}
                      </span>

                      <span className='flex items-center justify-end font-mono text-sm font-medium'>
                        {payload.stats[key].toLocaleString()}
                      </span>

                      <span
                        className={clsx(
                          'ml-2 text-xs text-center p-1 rounded',
                          {
                            'bg-red-100/50 text-red-600': payload.change[key] < 0,
                            'bg-green-100/50 text-green-600': payload.change[key] > 0,
                            'bg-gray-100 text-gray-600': payload.change[key] === 0
                          }
                        )}
                      >
                        {(payload.change[key] * 100).toFixed(1)}%
                      </span>
                    </Fragment>
                  ))}
              </span>
            )
          }}
        />
      )}
    />
  )
}
