import { format } from 'date-fns'
import { useRecoilValue } from 'recoil'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import useSortedItems from '../utils/useSortedItems'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'
import { IconArrowRight } from '@tabler/icons-react'
import clsx from 'clsx'
import Pagination from '../components/Pagination'
import TextInput from '../components/TextInput'
import useSearch from '../utils/useSearch'
import useChannels from '../api/useChannels'

export default function Channels() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { search, setSearch, page, setPage, debouncedSearch } = useSearch()

  const {
    channels,
    loading,
    count,
    itemsPerPage,
    error
  } = useChannels(activeGame, debouncedSearch, page)

  const sortedChannels = useSortedItems(channels, 'memberCount')

  const navigate = useNavigate()

  const goToPlayer = (identifier: string) => {
    navigate(`${routes.players}?search=${identifier}`)
  }

  return (
    <Page
      title='Channels'
      isLoading={loading}
    >
      {channels.length > 0 &&
        <div className='flex items-center'>
          <div className='w-1/2 flex-grow md:flex-grow-0 md:w-[400px]'>
            <TextInput
              id='channel-search'
              type='search'
              placeholder='Search...'
              onChange={setSearch}
              value={search}
            />
          </div>
          {Boolean(count) && <span className='ml-4'>{count} {count === 1 ? 'channel' : 'channels'}</span>}
        </div>
      }

      {!error && !loading && sortedChannels.length === 0 &&
        <>
          {debouncedSearch.length > 0 &&
            <p>No channels match your query</p>
          }
          {debouncedSearch.length === 0 &&
            <p>{activeGame.name} doesn&apos;t have any channels yet</p>
          }
        </>
      }

      {!error && sortedChannels.length > 0 &&
        <>
          <Table columns={['Name', 'Owner', 'Member count', 'Total messages', 'Created at', 'Updated at']}>
            <TableBody iterator={sortedChannels}>
              {(channel) => (
                <>
                  <TableCell>{channel.name}</TableCell>
                  <TableCell>
                    {channel.owner &&
                      <div className='flex items-center'>
                        <span>{channel.owner.identifier}</span>
                        <Button
                          variant='icon'
                          className={clsx('ml-2 p-1 rounded-full bg-indigo-900')}
                          onClick={() => goToPlayer(channel.owner!.identifier)}
                          icon={<IconArrowRight size={16} />}
                        />
                      </div>
                    }
                    {!channel.owner && 'Game-owned'}
                  </TableCell>
                  <TableCell>{new Intl.NumberFormat('en-GB').format(channel.memberCount)}</TableCell>
                  <TableCell>{new Intl.NumberFormat('en-GB').format(channel.totalMessages)}</TableCell>
                  <DateCell>{format(new Date(channel.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                  <DateCell>{format(new Date(channel.updatedAt), 'dd MMM Y, HH:mm')}</DateCell>
                </>
              )}
            </TableBody>
          </Table>

          {Boolean(count) && <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />}
        </>
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
