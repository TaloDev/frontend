import { IconArrowRight } from '@tabler/icons-react'
import clsx from 'clsx'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import useChannelStorage from '../api/useChannelStorage'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import Pagination from '../components/Pagination'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import TextInput from '../components/TextInput'
import routes from '../constants/routes'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import useSearch from '../utils/useSearch'
import useSortedItems from '../utils/useSortedItems'

export default function ChannelStorage() {
  const { channelId } = useParams()
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { search, setSearch, page, setPage, debouncedSearch } = useSearch()

  const { storageProps, channelName, loading, count, itemsPerPage, error, errorStatusCode } =
    useChannelStorage(activeGame, Number(channelId!), debouncedSearch, page)

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
      {(sortedProps.length > 0 || debouncedSearch.length > 0) && (
        <div className='flex items-center'>
          <div className='w-1/2 grow md:w-100 md:grow-0'>
            <TextInput
              id='storage-search'
              type='search'
              placeholder='Search...'
              onChange={setSearch}
              value={search}
            />
          </div>
          {Boolean(count) && (
            <span className='ml-4'>
              {count} storage {count === 1 ? 'prop' : 'props'}
            </span>
          )}
        </div>
      )}

      {!error && !loading && storageProps.length === 0 && (
        <>
          {debouncedSearch.length > 0 && <p>No storage props match your query</p>}
          {debouncedSearch.length === 0 && channelName && (
            <p>{channelName} doesn&apos;t have any storage props yet</p>
          )}
        </>
      )}

      {!error && storageProps.length > 0 && (
        <>
          <Table
            columns={['Key', 'Value', 'Created by', 'Last updated by', 'Created at', 'Updated at']}
          >
            <TableBody iterator={sortedProps}>
              {(storageProp) => (
                <>
                  <TableCell>{storageProp.key}</TableCell>
                  <TableCell className='max-w-100 min-w-100'>
                    <span className='flex rounded bg-gray-900 text-xs'>
                      <code className='inline-block p-2 align-middle break-all'>
                        {storageProp.value}
                      </code>
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <span>{storageProp.createdBy.identifier}</span>
                      <Button
                        variant='icon'
                        className={clsx('ml-2 rounded-full bg-indigo-900 p-1')}
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
                        className={clsx('ml-2 rounded-full bg-indigo-900 p-1')}
                        onClick={() => goToPlayer(storageProp.lastUpdatedBy.identifier)}
                        icon={<IconArrowRight size={16} />}
                      />
                    </div>
                  </TableCell>
                  <DateCell>
                    {format(new Date(storageProp.createdAt), 'dd MMM yyyy, HH:mm')}
                  </DateCell>
                  <DateCell>
                    {format(new Date(storageProp.updatedAt), 'dd MMM yyyy, HH:mm')}
                  </DateCell>
                </>
              )}
            </TableBody>
          </Table>

          {count && itemsPerPage && (
            <Pagination count={count} pageState={[page, setPage]} itemsPerPage={itemsPerPage} />
          )}
        </>
      )}

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
