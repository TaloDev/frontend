import { IconPlus, IconZoom } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import useStats from '../api/useStats'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import StatDetails from '../modals/StatDetails'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import useSortedItems from '../utils/useSortedItems'
import { GameStat } from '../entities/gameStat'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'

export default function Stats() {
  const [showModal, setShowModal] = useState(false)
  const [editingStat, setEditingStat] = useState<GameStat | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const { stats, loading, error, mutate } = useStats(activeGame)

  const sortedStats = useSortedItems(stats, 'internalName', 'asc')

  const navigate = useNavigate()

  useEffect(() => {
    if (!showModal) setEditingStat(null)
  }, [showModal, setEditingStat])

  const onEditStatClick = useCallback((stat: GameStat) => {
    setEditingStat(stat)
    setShowModal(true)
  }, [])

  const onViewMetricsClick = useCallback((stat: GameStat) => {
    navigate(routes.statMetrics.replace(':internalName', stat.internalName))
  }, [navigate])

  return (
    <Page
      title='Stats'
      extraTitleComponent={
        <div className='mt-1 ml-4 p-1 rounded-full bg-indigo-600'>
          <Button
            variant='icon'
            onClick={() => setShowModal(true)}
            icon={<IconPlus />}
            extra={{ 'aria-label': 'Create stat' }}
          />
        </div>
      }
      isLoading={loading}
    >
      {!error && !loading && sortedStats.length === 0 &&
        <p>{activeGame.name} doesn&apos;t have any stats yet</p>
      }

      {!error && sortedStats.length > 0 &&
        <Table columns={['Internal name', 'Display name', 'Global value', 'Created at', 'Updated at', '', '']}>
          <TableBody iterator={sortedStats}>
            {(stat) => (
              <>
                <TableCell>{stat.internalName}</TableCell>
                <TableCell>{stat.name}</TableCell>
                <TableCell className='font-mono'>{stat.global ? stat.globalValue.toLocaleString() : '—'}</TableCell>
                <DateCell>{format(new Date(stat.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                <DateCell>{format(new Date(stat.updatedAt), 'dd MMM Y, HH:mm')}</DateCell>
                <TableCell className='w-40'>
                  {stat.global &&
                    <Button variant='grey' icon={<IconZoom size={16} />} onClick={() => onViewMetricsClick(stat)}>
                      <span>Metrics</span>
                    </Button>
                  }
                </TableCell>
                <TableCell className='w-40'>
                  <Button variant='grey' onClick={() => onEditStatClick(stat)}>Edit</Button>
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      }

      {error && <ErrorMessage error={error} />}

      {showModal &&
        <StatDetails
          modalState={[showModal, setShowModal]}
          mutate={mutate}
          editingStat={editingStat}
        />
      }
    </Page>
  )
}
