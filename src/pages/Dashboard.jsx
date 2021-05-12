
import React from 'react'
import { useRecoilValue } from 'recoil'
import useHeadlines from '../api/useHeadlines'
import ErrorMessage from '../components/ErrorMessage'
import HeadlineStat from '../components/HeadlineStat'
import activeGameState from '../state/activeGameState'

const Dashboard = () => {
  const activeGame = useRecoilValue(activeGameState)
  const { headlines, loading, error } = useHeadlines(activeGame)

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

      {error &&
        <div className='mt-4'>
          <ErrorMessage error={{ message: `Couldn't fetch headlines` }} />
        </div>
      }

      {!loading && !error &&
        <h2 className='text-2xl mt-4'>This week&apos;s stats</h2>
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
