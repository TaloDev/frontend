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
import { IconArrowRight, IconPlus } from '@tabler/icons-react'
import clsx from 'clsx'
import Pagination from '../components/Pagination'
import TextInput from '../components/TextInput'
import useSearch from '../utils/useSearch'
import useChannels from '../api/useChannels'
import { GameChannel } from '../entities/gameChannels'
import { useEffect, useState } from 'react'
import ChannelDetails from '../modals/ChannelDetails'

export default function Channels() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { search, setSearch, page, setPage, debouncedSearch } = useSearch()

  const {
    channels,
    loading,
    count,
    itemsPerPage,
    error,
    mutate
  } = useChannels(activeGame, debouncedSearch, page)

  const sortedChannels = useSortedItems(channels, 'memberCount')

  const [showModal, setShowModal] = useState(false)
  const [editingChannel, setEditingChannel] = useState<GameChannel | null>(null)

  useEffect(() => {
    if (!showModal) setEditingChannel(null)
  }, [showModal, editingChannel])

  const navigate = useNavigate()

  const goToPlayer = (identifier: string) => {
    navigate(`${routes.players}?search=${identifier}`)
  }

  const goToPlayersForChannel = (channel: GameChannel) => {
    navigate(`${routes.players}?search=channel:${channel.id}`)
  }

  const onEditChannelClick = (channel: GameChannel) => {
    setEditingChannel(channel)
    setShowModal(true)
  }

  return (
    <Page
      title='Channels'
      isLoading={loading}
      extraTitleComponent={
        <div className='mt-1 ml-4 p-1 rounded-full bg-indigo-600'>
          <Button
            variant='icon'
            onClick={() => setShowModal(true)}
            icon={<IconPlus />}
            extra={{ 'aria-label': 'Create channel' }}
          />
        </div>
      }
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
          <Table columns={['Name', 'Owner', 'Member count', 'Total messages', 'Created at', 'Updated at', '', '']}>
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
                  <TableCell className='font-mono'>{channel.memberCount.toLocaleString()}</TableCell>
                  <TableCell className='font-mono'>{channel.totalMessages.toLocaleString()}</TableCell>
                  <DateCell>{format(new Date(channel.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                  <DateCell>{format(new Date(channel.updatedAt), 'dd MMM Y, HH:mm')}</DateCell>
                  <TableCell className='w-40'>
                    <Button
                      variant='grey'
                      onClick={() => onEditChannelClick(channel)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell className='w-48'>
                    <Button
                      variant='grey'
                      onClick={() => goToPlayersForChannel(channel)}
                    >
                      View players
                    </Button>
                  </TableCell>
                </>
              )}
            </TableBody>
          </Table>

          {Boolean(count) && <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />}
        </>
      }

      {error && <ErrorMessage error={error} />}

      {showModal &&
        <ChannelDetails
          modalState={[showModal, setShowModal]}
          mutate={mutate}
          editingChannel={editingChannel}
        />
      }
    </Page>
  )
}
