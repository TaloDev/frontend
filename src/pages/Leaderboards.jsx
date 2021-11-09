import React from 'react'
import Title from '../components/Title'
import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import TableHeader from '../components/tables/TableHeader'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import DateCell from '../components/tables/cells/DateCell'
import useLeaderboards from '../api/useLeaderboards'
import { useRecoilValue } from 'recoil'
import activeGameState from '../state/activeGameState'
import { IconChevronUp, IconChevronDown } from '@tabler/icons'
import Button from '../components/Button'
import { useHistory } from 'react-router'
import routes from '../constants/routes'

const Leaderboards = () => {
  const activeGame = useRecoilValue(activeGameState)
  const history = useHistory()

  const { leaderboards, loading, error } = useLeaderboards(activeGame)

  const goToEntries = (leaderboard) => {
    history.push({
      pathname: routes.leaderboardEntries.replace(':internalName', leaderboard.internalName),
      state: { leaderboard }
    })
  }

  return (
    <div className='space-y-4 md:space-y-8'>
      <div className='flex items-center'>
        <Title>Leaderboards</Title>

        {loading &&
          <div className='mt-1 ml-4'>
            <Loading size={24} thickness={180} />
          </div>
        }
      </div>

      {!error && leaderboards.length === 0 &&
        <p>TODO no leaderboards yet</p>
      }

      {!error && leaderboards.length > 0 &&
        <div className='overflow-x-scroll'>
          <table className='table-auto w-full'>
            <TableHeader columns={['Internal name', 'Display name', 'Sort mode', 'Unique entries', 'Created at', '']} />
            <TableBody iterator={leaderboards}>
              {(leaderboard) => (
                <>
                  <TableCell>{leaderboard.internalName}</TableCell>
                  <TableCell>{leaderboard.name}</TableCell>
                  <TableCell>
                    {leaderboard.sortMode === 'asc'
                      ? <span><IconChevronUp className='inline-block mr-1 mb-0.5' /> Ascending</span>
                      : <span><IconChevronDown className='inline-block mr-1' /> Descending</span>
                    }
                  </TableCell>
                  <TableCell>{leaderboard.unique ? 'Yes' : 'No'}</TableCell>
                  <DateCell>{format(new Date(leaderboard.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                  <TableCell className='w-40'>
                    <Button variant='grey' onClick={() => goToEntries(leaderboard)}>View entries</Button>
                  </TableCell>
                </>
              )}
            </TableBody>
          </table>
        </div>
      }

      <ErrorMessage error={error} />
    </div>
  )
}

export default Leaderboards
