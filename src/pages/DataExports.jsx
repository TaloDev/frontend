import React, { useState } from 'react'
import Title from '../components/Title'
import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import TableHeader from '../components/tables/TableHeader'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import DateCell from '../components/tables/cells/DateCell'
import activeGameState from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import useDataExports from '../api/useDataExports'
import Button from '../components/Button'
import useDataExportEntities from '../api/useDataExportEntities'
import createDataExport from '../api/createDataExport'
import userState from '../state/userState'
import useSortedItems from '../utils/useSortedItems'
import AlertBanner from '../components/AlertBanner'
import { IconCheck } from '@tabler/icons'
import buildError from '../utils/buildError'
import classNames from 'classnames'

const dataExportStatuses = ['Requested', 'Processing', 'Processing', 'Delivered']

const DataExports = () => {
  const user = useRecoilValue(userState)
  const activeGame = useRecoilValue(activeGameState)

  const [isCreating, setCreating] = useState(false)
  const [selectedEntities, setSelectedEntities] = useState([])
  const [createdExportId, setCreatedExportId] = useState(null)

  const { dataExports, loading: dataExportsLoading, error: fetchError } = useDataExports(activeGame, createdExportId)
  const { entities: availableEntities, error: entitiesError } = useDataExportEntities()

  const sortedDataExports = useSortedItems(dataExports, 'createdAt')

  const [createError, setCreateError] = useState(null)

  const onCreateClick = async (e) => {
    e.preventDefault()

    setCreating(true)

    try {
      const res = await createDataExport(activeGame.id, selectedEntities)
      setCreatedExportId(res.data.dataExport.id)
    } catch (err) {
      setCreateError(buildError(err))
    } finally {
      setCreating(false)
    }
  }

  const onScopeChecked = (e) => {
    if (e.target.checked) {
      setSelectedEntities([...selectedEntities, e.target.value])
    } else {
      setSelectedEntities(selectedEntities.filter((s) => s !== e.target.value))
    }
  }

  return (
    <div className='space-y-4 md:space-y-8'>
      <div className='flex items-center'>
        <Title>Data exports</Title>

        {dataExportsLoading &&
          <div className='mt-1 ml-4'>
            <Loading size={24} thickness={180} />
          </div>
        }
      </div>

      {!fetchError && dataExports.length > 0 &&
        <div className='overflow-x-scroll'>
          <table className='table-auto w-full'>
            <TableHeader columns={['Status', 'Entities', 'Created at', 'Created by']} />
            <TableBody iterator={sortedDataExports}>
              {(dataExport) => (
                <>
                  <TableCell>
                    <span className={classNames('bg-gray-900 rounded p-1', {
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
          </table>
        </div>
      }

      {fetchError && <ErrorMessage error={fetchError} />}

      {!createdExportId &&
        <form className='w-full lg:2/3 xl:w-1/2 space-y-4'>
          <h2 className='text-xl lg:text-2xl font-bold'>Create new data export</h2>

          <div className='rounded border-2 border-gray-700'>
            <div className='p-4 bg-gray-700'>
              <h3 className='text-lg font-bold'>Entities</h3>
              <p>Choose which entities you would like to generate CSVs for</p>
            </div>

            <div className='flex space-x-8 p-4'>
              {entitiesError && <ErrorMessage error={{ message: 'Couldn\'t fetch available entities' }} />}
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

          {createError && <ErrorMessage error={createError} />}

          <Button
            isLoading={isCreating}
            disabled={selectedEntities.length === 0}
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
    </div>
  )
}

export default DataExports
