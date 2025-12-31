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
import { useNavigate, useParams } from 'react-router-dom'
import routes from '../constants/routes'
import { IconArrowRight } from '@tabler/icons-react'
import clsx from 'clsx'
import Pagination from '../components/Pagination'
import TextInput from '../components/TextInput'
import useSearch from '../utils/useSearch'
import useChannelStorage from '../api/useChannelStorage'
import { useEffect } from 'react'

export default function ChannelStorage() {
  const { channelId } = useParams()
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { search, setSearch, page, setPage, debouncedSearch } = useSearch()

  const {
    storageProps,
    channelName,
    loading,
    count,
    itemsPerPage,
    error,
    errorStatusCode
  } = useChannelStorage(activeGame, Number(channelId!), debouncedSearch, page)

  const sortedProps = useSortedItems(storageProps, 'updatedAt')

  const navigate = useNavigate()

  const goToPlayer = (identifier: string) => {
    navigate(`${routes.players}?search=${identifier}`)
  }

  const channelNotFound = errorStatusCode === 404

  useEffect(() => {
    if (channelNotFound) {
      navigate(routes.channels, { replace: true })
    }
  }, [channelNotFound, navigate])

  if (channelNotFound) {
    return null
  }

  return (
    <Page
      showBackButton
      title={channelName ? `${channelName} storage` : 'Channel storage'}
      isLoading={loading}
    >
      {(sortedProps.length > 0 || debouncedSearch.length > 0) &&
        <div className='flex items-center'>
          <div className='w-1/2 grow md:grow-0 md:w-[400px]'>
            <TextInput
              id='storage-search'
              type='search'
              placeholder='Search...'
              onChange={setSearch}
              value={search}
            />
          </div>
          {Boolean(count) && <span className='ml-4'>{count} storage {count === 1 ? 'prop' : 'props'}</span>}
        </div>
      }

      {!error && !loading && storageProps.length === 0 &&
        <>
          {debouncedSearch.length > 0 &&
            <p>No storage props match your query</p>
          }
          {debouncedSearch.length === 0 && channelName &&
            <p>{channelName} doesn&apos;t have any storage props yet</p>
          }
        </>
      }

      {!error && storageProps.length > 0 &&
        <>
          <Table columns={['Key', 'Value', 'Created by', 'Last updated by', 'Created at', 'Updated at']}>
            <TableBody iterator={sortedProps}>
              {(storageProp) => (
                <>
                  <TableCell>{storageProp.key}</TableCell>
                  <TableCell className='min-w-[400px] max-w-[400px]'>
                    <span className='bg-gray-900 rounded text-xs flex'>
                      <code className='align-middle inline-block p-2 break-all'>{storageProp.value}</code>
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <span>{storageProp.createdBy.identifier}</span>
                      <Button
                        variant='icon'
                        className={clsx('ml-2 p-1 rounded-full bg-indigo-900')}
                        onClick={() => goToPlayer(storageProp.createdBy.identifier)}
                        icon={<IconArrowRight size={16} />}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <span>{storageProp.lastUpdatedBy.identifier}</span>
                      <Button
                        variant='icon'
                        className={clsx('ml-2 p-1 rounded-full bg-indigo-900')}
                        onClick={() => goToPlayer(storageProp.lastUpdatedBy.identifier)}
                        icon={<IconArrowRight size={16} />}
                      />
                    </div>
                  </TableCell>
                  <DateCell>{format(new Date(storageProp.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                  <DateCell>{format(new Date(storageProp.updatedAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                </>
              )}
            </TableBody>
          </Table>

          {count && itemsPerPage && (
            <Pagination count={count} pageState={[page, setPage]} itemsPerPage={itemsPerPage} />
          )}
        </>
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
