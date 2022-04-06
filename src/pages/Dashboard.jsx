
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import useHeadlines from '../api/useHeadlines'
import ErrorMessage from '../components/ErrorMessage'
import HeadlineStat from '../components/HeadlineStat'
import TimePeriodPicker from '../components/TimePeriodPicker'
import Page from '../components/Page'
import routes from '../constants/routes'
import activeGameState from '../state/activeGameState'
import canViewPage from '../utils/canViewPage'
import useLocalStorage from '../utils/useLocalStorage'
import useTimePeriod from '../utils/useTimePeriod'
import Link from '../components/Link'
import userState from '../state/userState'
import useStats from '../api/useStats'

const Dashboard = () => {
  const history = useHistory()

  const [intendedRouteChecked, setIntendedRouteChecked] = useState(false)
  const user = useRecoilValue(userState)

  useEffect(() => {
    const intended = window.localStorage.getItem('intendedRoute')
    if (intended) {
      window.localStorage.removeItem('intendedRoute')
      history.replace(intended)
    } else {
      setIntendedRouteChecked(true)
    }
  }, [])

  const activeGame = useRecoilValue(activeGameState)

  const timePeriods = [
    { id: '7d', label: '7 days', titlePrefix: 'Last 7 days' },
    { id: '30d', label: '30 days', titlePrefix: 'Last 30 days' },
    { id: 'w', label: 'This week', titlePrefix: 'This week' },
    { id: 'm', label: 'This month', titlePrefix: 'This month' },
    { id: 'y', label: 'This year', titlePrefix: 'This year' }
  ]

  const [timePeriod, setTimePeriod] = useLocalStorage('headlinesTimePeriod', timePeriods[1].id)
  const { startDate, endDate } = useTimePeriod(timePeriod)
  const { headlines, loading: headlinesLoading, error: headlinesError } = useHeadlines(activeGame, startDate, endDate)
  const { stats, loading: statsLoading, error: statsError } = useStats(activeGame)

  if (!intendedRouteChecked) return null

  if (!activeGame) {
    return (
      <div>
        <h1 className='text-4xl font-bold'>Hey there</h1>
        <p className='mt-2'>Welcome to Talo! To get started, create a new game using the button in the top right</p>
      </div>
    )
  }

  const titlePrefix = timePeriods.find((period) => period.id === timePeriod).titlePrefix

  return (
    <Page title={`${activeGame.name} dashboard`} isLoading={headlinesLoading || statsLoading}>
      <div className='flex flex-col-reverse md:flex-row md:justify-between md:items-center'>
        <h2 className='text-2xl mt-4 md:mt-0'>{titlePrefix} at a glance</h2>
        <TimePeriodPicker
          periods={timePeriods}
          onPick={(period) => setTimePeriod(period.id)}
          selectedPeriod={timePeriod}
        />
      </div>

      {headlinesError &&
        <ErrorMessage error={{ message: 'Couldn\'t fetch headlines' }} />
      }

      {!headlinesLoading &&
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <HeadlineStat title='New players' stat={headlines.new_players.count} />
          <HeadlineStat title='Returning players' stat={headlines.returning_players.count} />
          <HeadlineStat title='New events' stat={headlines.events.count} />
          <HeadlineStat title='Unique event submitters' stat={headlines.unique_event_submitters.count} />
        </div>
      }

      <h2 className='text-2xl'>Global stats</h2>

      {statsError &&
        <ErrorMessage error={{ message: 'Couldn\'t fetch stats' }} />
      }

      {!statsLoading &&
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {stats.filter((stat) => stat.global).map((stat) => (
            <HeadlineStat key={stat.id} title={stat.name} stat={stat.globalValue} />
          ))}
        </div>
      }

      {canViewPage(user, routes.activity) &&
        <div className='!mb-24'>
          <h2 className='text-2xl mt-4 mb-2 md:mt-0'>Activity</h2>
          <Link to={routes.activity}>Go to activity log</Link>
        </div>
      }
    </Page>
  )
}

export default Dashboard
