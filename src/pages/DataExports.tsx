import { ChangeEvent, MouseEvent, useState } from 'react'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import { format } from 'date-fns'
import DateCell from '../components/tables/cells/DateCell'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import useDataExports from '../api/useDataExports'
import Button from '../components/Button'
import useDataExportEntities from '../api/useDataExportEntities'
import createDataExport from '../api/createDataExport'
import userState, { AuthedUser } from '../state/userState'
import useSortedItems from '../utils/useSortedItems'
import AlertBanner from '../components/AlertBanner'
import { IconCheck } from '@tabler/icons-react'
import buildError from '../utils/buildError'
import clsx from 'clsx'
import Page from '../components/Page'
import DevDataStatus from '../components/DevDataStatus'
import Table from '../components/tables/Table'
import { AxiosError } from 'axios'
import { DataExportAvailableEntities } from '../entities/dataExport'

const dataExportStatuses = ['Requested', 'Processing', 'Processing', 'Delivered']

export default function DataExports() {
  const user = useRecoilValue(userState) as AuthedUser
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const [isCreating, setCreating] = useState(false)
  const [selectedEntities, setSelectedEntities] = useState<DataExportAvailableEntities[]>([])
  const [createdExportId, setCreatedExportId] = useState<number | null>(null)

  const { dataExports, loading: dataExportsLoading, error: fetchError } = useDataExports(activeGame, createdExportId)
  const { entities: availableEntities, error: entitiesError } = useDataExportEntities(activeGame)

  const sortedDataExports = useSortedItems(dataExports, 'createdAt')

  const [createError, setCreateError] = useState<TaloError | null>(null)

  const onCreateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    setCreating(true)

    try {
      const { dataExport } = await createDataExport(activeGame.id, selectedEntities)
      setCreatedExportId(dataExport.id)
    } catch (err) {
      if ((err as AxiosError).response?.status === 402) {
        setCreateError(buildError('You have reached the data export limit for this month, please contact the account owner about upgrading the pricing plan'))
      } else {
        setCreateError(buildError(err))
      }
    } finally {
      setCreating(false)
    }
  }

  const onScopeChecked = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEntities([...selectedEntities, e.target.value as DataExportAvailableEntities])
    } else {
      setSelectedEntities(selectedEntities.filter((s) => s !== e.target.value))
    }
  }

  return (
    <Page title='Data exports' isLoading={dataExportsLoading}>
      {!user.emailConfirmed &&
        <AlertBanner className='lg:w-max' text='You need to confirm your email address to export data' />
      }

      <DevDataStatus />

      {!fetchError && dataExports.length > 0 &&
        <Table columns={['Status', 'Entities', 'Created at', 'Created by']}>
          <TableBody iterator={sortedDataExports}>
            {(dataExport) => (
              <>
                <TableCell>
                  <span className={clsx('bg-gray-900 rounded p-1', {
                    '!text-red-400': Boolean(dataExport.failedAt),
                    'text-green-400': dataExport.id === createdExportId
                  })}>
                    {dataExport.failedAt ? 'Failed' : dataExportStatuses[dataExport.status]}
                  </span>
                </TableCell>
                <TableCell className='capitalize'>{dataExport.entities.join(', ')}</TableCell>
                <DateCell>{format(new Date(dataExport.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                <TableCell>{dataExport.createdBy === user.email ? 'You' : dataExport.createdBy}</TableCell>
              </>
            )}
          </TableBody>
        </Table>
      }

      {fetchError && <ErrorMessage error={fetchError} />}

      {!createdExportId &&
        <form className='w-full lg:2/3 xl:w-1/2 space-y-4'>
          <h2 className='text-xl lg:text-2xl font-bold'>Create data export</h2>

          <div className='rounded border-2 border-gray-700'>
            <div className='p-4 bg-gray-700'>
              <h3 className='text-lg font-bold'>Entities</h3>
              <p>Choose which entities you would like to generate CSVs for</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4'>
              {!entitiesError && availableEntities && availableEntities.map((service) => (
                <div key={service}>
                  <input
                    id={service}
                    type='checkbox'
                    onChange={onScopeChecked}
                    checked={Boolean(selectedEntities.find((s) => s === service))}
                    value={service}
                  />
                  <label htmlFor={service} className='ml-2 capitalize'>{service}</label>
                </div>
              ))}
            </div>
          </div>

          {entitiesError && <ErrorMessage error={{ message: 'Couldn\'t fetch available entities' }} />}

          {createError && <ErrorMessage error={createError} />}

          <Button
            isLoading={isCreating}
            disabled={selectedEntities.length === 0 || !user.emailConfirmed}
            variant='green'
            onClick={onCreateClick}
          >
            Create
          </Button>
        </form>
      }

      {createdExportId &&
        <div className='w-full lg:2/3 xl:w-1/2'>
          <AlertBanner className='bg-green-600' icon={IconCheck} text={'Success! We\'ll email you when your export is ready'} />
        </div>
      }
    </Page>
  )
}
