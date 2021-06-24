
import React from 'react'
import { useRecoilValue } from 'recoil'
import useHeadlines from '../api/useHeadlines'
import ErrorMessage from '../components/ErrorMessage'
import HeadlineStat from '../components/HeadlineStat'
import TimePeriodPicker from '../components/TimePeriodPicker'
import activeGameState from '../state/activeGameState'
import useLocalStorage from '../utils/useLocalStorage'
import useTimePeriod from '../utils/useTimePeriod'

const Dashboard = () => {
  const activeGame = useRecoilValue(activeGameState)

  const timePeriods = [
    { id: '7d', label: '7 days', titleSuffix: 'the last 7 days' },
    { id: '30d', label: '30 days', titleSuffix: 'the last 30 days' },
    { id: 'w', label: 'This week', titleSuffix: 'this week' },
    { id: 'm', label: 'This month', titleSuffix: 'this month' },
    { id: 'y', label: 'This year', titleSuffix: 'this year' }
  ]

  const [timePeriod, setTimePeriod] = useLocalStorage('headlinesTimePeriod', timePeriods[0])
  const { startDate, endDate } = useTimePeriod(timePeriod.id)
  const { headlines, loading, error } = useHeadlines(activeGame, startDate, endDate)

  if (!activeGame) {
    return (
      <div>
        <h1 className='text-4xl font-bold'>Hey there</h1>
        <p className='mt-2'>Welcome to Talo! To get started, create a new game using the button in the top right</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className='text-4xl font-bold'>{activeGame.name} dashboard</h1>

      <div className='flex flex-col-reverse md:flex-row md:justify-between md:items-center mt-8'>
        <h2 className='text-2xl mt-4 md:mt-0'>Stats for {timePeriod.titleSuffix}</h2>
        <TimePeriodPicker
          periods={timePeriods}
          onPick={setTimePeriod}
          selectedPeriod={timePeriod.id}
        />
      </div>

      {error &&
        <div className='mt-8'>
          <ErrorMessage error={{ message: `Couldn't fetch headlines` }} />
        </div>
      }

      {!loading && !error &&
        <div className='lg:flex'>
          <div className='md:flex md:space-x-4 lg:w-1/2'>
            <HeadlineStat title='New players' stat={headlines.new_players.count} />
            <HeadlineStat title='Returning players' stat={headlines.returning_players.count} />
          </div>
          <div className='md:flex md:space-x-4 lg:w-1/2 lg:ml-4'>
            <HeadlineStat title='New events' stat={headlines.events.count} />
            <HeadlineStat title='Unique event submitters' stat={headlines.unique_event_submitters.count} />
          </div>
        </div>
      }
    </div>
  )
}

export default Dashboard
