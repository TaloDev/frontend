import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import useHeadlines from '../api/useHeadlines'
import usePinnedGroups from '../api/usePinnedGroups'
import usePlayerHeadlines from '../api/usePlayerHeadlines'
import useStats from '../api/useStats'
import DevDataStatus from '../components/DevDataStatus'
import ErrorMessage from '../components/ErrorMessage'
import HeadlineStat from '../components/HeadlineStat'
import Page from '../components/Page'
import SecondaryNav from '../components/SecondaryNav'
import SecondaryTitle from '../components/SecondaryTitle'
import TimePeriodPicker from '../components/TimePeriodPicker'
import { secondaryNavRoutes } from '../constants/secondaryNavRoutes'
import activeGameState from '../state/activeGameState'
import devDataState from '../state/devDataState'
import useIntendedRoute from '../utils/useIntendedRoute'
import useLocalStorage from '../utils/useLocalStorage'
import useTimePeriod, { TimePeriod } from '../utils/useTimePeriod'

export default function Dashboard() {
  const includeDevData = useRecoilValue(devDataState)

  const activeGame = useRecoilValue(activeGameState)

  const timePeriods: {
    id: TimePeriod
    label: string
    titlePrefix: string
  }[] = [
    { id: '1d', label: 'Today', titlePrefix: 'Today' },
    { id: '7d', label: '7 days', titlePrefix: 'Last 7 days' },
    { id: '30d', label: '30 days', titlePrefix: 'Last 30 days' },
    { id: 'w', label: 'This week', titlePrefix: 'This week' },
    { id: 'm', label: 'This month', titlePrefix: 'This month' },
    { id: 'y', label: 'This year', titlePrefix: 'This year' },
  ]

  const [timePeriod, setTimePeriod] = useLocalStorage('headlinesTimePeriod', timePeriods[1].id)
  const { startDate, endDate } = useTimePeriod(timePeriod)
  const {
    headlines,
    loading: headlinesLoading,
    error: headlinesError,
  } = useHeadlines(activeGame, startDate, endDate, includeDevData)
  const { stats, loading: statsLoading, error: statsError } = useStats(activeGame, includeDevData)
  const {
    groups: pinnedGroups,
    loading: pinnedGroupsLoading,
    error: pinnedGroupsError,
  } = usePinnedGroups(activeGame, includeDevData)
  const {
    headlines: playerHeadlines,
    loading: playerHeadlinesLoading,
    error: playerHeadlinesError,
  } = usePlayerHeadlines(activeGame, includeDevData)
  const intendedRouteChecked = useIntendedRoute()

  const globalStats = useMemo(() => {
    return stats.filter((stat) => stat.global)
  }, [stats])

  if (!intendedRouteChecked) return null

  if (!activeGame) {
    return (
      <Page title="Let's get started!" disableBanners>
        <p>Welcome to Talo! To get started, create a new game using the button in the top right</p>
      </Page>
    )
  }

  const titlePrefix = timePeriods.find((period) => period.id === timePeriod)!.titlePrefix

  return (
    <Page
      title={`${activeGame.name} dashboard`}
      isLoading={headlinesLoading || statsLoading}
      secondaryNav={<SecondaryNav routes={secondaryNavRoutes} />}
    >
      <DevDataStatus />

      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <SecondaryTitle className='mb-4 md:mb-0'>{titlePrefix} at a glance</SecondaryTitle>
        <TimePeriodPicker
          periods={timePeriods}
          onPick={(period) => setTimePeriod(period.id)}
          selectedPeriod={timePeriod}
        />
      </div>

      {headlinesError && <ErrorMessage error={{ message: "Couldn't fetch headlines" }} />}

      {!headlinesLoading && !headlinesError && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <HeadlineStat title='New players' stat={headlines.new_players.count} />
          <HeadlineStat title='Returning players' stat={headlines.returning_players.count} />
          <HeadlineStat title='Total sessions' stat={headlines.total_sessions.count} />
          <HeadlineStat
            title='Average session duration'
            stat={`${Math.round(headlines.average_session_duration.hours)}h ${Math.round(headlines.average_session_duration.minutes)}m ${Math.round(headlines.average_session_duration.seconds)}s`}
          />
          <HeadlineStat title='New events' stat={headlines.events.count} />
          <HeadlineStat
            title='Unique event submitters'
            stat={headlines.unique_event_submitters.count}
          />
        </div>
      )}

      <SecondaryTitle>Players</SecondaryTitle>

      {playerHeadlinesError && (
        <ErrorMessage error={{ message: "Couldn't fetch player headlines" }} />
      )}

      {!playerHeadlinesLoading && !playerHeadlinesError && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <HeadlineStat title='Total players' stat={playerHeadlines.total_players.count} />
          <HeadlineStat title='Online players' stat={playerHeadlines.online_players.count} />
        </div>
      )}

      {pinnedGroups.length > 0 && <SecondaryTitle>Pinned groups</SecondaryTitle>}

      {pinnedGroupsError && <ErrorMessage error={{ message: "Couldn't fetch pinned groups" }} />}

      {!pinnedGroupsLoading && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {pinnedGroups.map((group) => (
            <HeadlineStat key={group.id} title={group.name} stat={group.count} />
          ))}
        </div>
      )}

      {globalStats.length > 0 && <SecondaryTitle>Global stats</SecondaryTitle>}

      {statsError && <ErrorMessage error={{ message: "Couldn't fetch stats" }} />}

      {!statsLoading && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {globalStats.map((stat) => (
            <HeadlineStat key={stat.id} title={stat.name} stat={stat.globalValue} />
          ))}
        </div>
      )}
    </Page>
  )
}
