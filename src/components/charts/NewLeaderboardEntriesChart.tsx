import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import useTimePeriodAndDates from '../../utils/useTimePeriodAndDates'
import { BarChartCard } from './BarChartCard'
import { ChartCardTooltip } from './ChartCardTooltip'
import { useNewLeaderboardEntriesChart } from '../../api/useNewLeaderboardEntriesChart'
import { Fragment } from 'react'
import clsx from 'clsx'
import { getPersistentColor } from '../../utils/getPersistentColour'

export function NewLeaderboardEntriesChart() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const {
    timePeriod,
    setTimePeriod,
    debouncedStartDate,
    debouncedEndDate
  } = useTimePeriodAndDates('newLeaderboardEntriesChart')

  const { leaderboards, leaderboardNames, loading, error } = useNewLeaderboardEntriesChart(activeGame, debouncedStartDate, debouncedEndDate)
  const bars = leaderboardNames.map((name) => ({
    dataKey: (p: typeof leaderboards[number]) => p.leaderboards[name] ?? null,
    stackId: 'leaderboards',
    fill: getPersistentColor(name)
  }))

  return (
    <BarChartCard
      title='New entries'
      data={leaderboards}
      bars={bars}
      loading={loading}
      error={error}
      timePeriod={timePeriod}
      onTimePeriodChange={(period) => setTimePeriod(period.id)}
      tooltip={(
        <ChartCardTooltip<typeof leaderboards[number]>
          formatter={(payload) => {
            return (
              <span className='text-black grid grid-cols-[2fr_1fr_0.5fr] gap-y-2 mt-4'>
                {Object.keys(payload.leaderboards)
                  .sort((keyA, keyB) => (payload.leaderboards[keyB] || payload.change[keyB]) - (payload.leaderboards[keyA] || payload.change[keyA]))
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
                        {payload.leaderboards[key].toLocaleString()}
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
