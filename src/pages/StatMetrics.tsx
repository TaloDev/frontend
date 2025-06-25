import { useRecoilValue } from 'recoil'
import useStats from '../api/useStats'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GameStat } from '../entities/gameStat'
import routes from '../constants/routes'
import SecondaryTitle from '../components/SecondaryTitle'
import DateInput from '../components/DateInput'
import useTimePeriodAndDates, { timePeriods } from '../utils/useTimePeriodAndDates'
import TimePeriodPicker from '../components/TimePeriodPicker'
import Loading from '../components/Loading'

type GameStatWithMetrics = Omit<GameStat, 'metrics'> & { metrics: NonNullable<GameStat['metrics']> }

export default function StatMetrics() {
  const { internalName } = useParams()
  const navigate = useNavigate()

  const {
    timePeriod,
    setTimePeriod,
    selectedStartDate,
    selectedEndDate,
    onStartDateChange,
    onEndDateChange
  } = useTimePeriodAndDates(`${internalName}-metrics`)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const { stats, loading, error } = useStats(activeGame, undefined, selectedStartDate, selectedEndDate)

  const getStat = useCallback(() => {
    return stats.find((stat) => stat.internalName === internalName)
  }, [internalName, stats])

  const [stat, setStat] = useState<GameStatWithMetrics | undefined>(getStat() as GameStatWithMetrics)

  const metrics = useMemo(() => {
    return stat?.metrics
  }, [stat])

  useEffect(() => {
    const matchingStat = getStat()
    if (!matchingStat && !loading) {
      navigate(routes.stats)
      return
    }

    setStat(matchingStat as GameStatWithMetrics)
  }, [getStat, internalName, loading, navigate, stat, stats])

  return (
    <Page
      title={`${stat?.name ?? 'Stat'} metrics`}
      isLoading={loading}
      showBackButton
    >
      <div className='justify-between items-start'>
        <div className='mb-4 md:mb-8'>
          <TimePeriodPicker
            periods={timePeriods}
            onPick={(period) => setTimePeriod(period.id)}
            selectedPeriod={timePeriod}
          />
        </div>

        <div className='flex items-end w-full md:w-1/2 space-x-4'>
          <div className='w-1/3'>
            <DateInput
              id='start-date'
              onDateTimeStringChange={onStartDateChange}
              value={selectedStartDate}
              textInputProps={{
                label: 'Start date',
                placeholder: 'Start date',
                errors: error?.keys.startDate,
                variant: undefined
              }}
            />
          </div>

          <div className='w-1/3'>
            <DateInput
              id='end-date'
              onDateTimeStringChange={onEndDateChange}
              value={selectedEndDate}
              textInputProps={{
                label: 'End date',
                placeholder: 'End date',
                errors: error?.keys.endDate,
                variant: undefined
              }}
            />
          </div>
        </div>
      </div>

      {!error &&
        <>
          <SecondaryTitle>Global metrics</SecondaryTitle>
          {metrics &&
            <Table columns={['Min value', 'Max value', 'Median value', 'Average value', 'Total updates', 'Average change']}>
              <TableBody iterator={[metrics]}>
                {(metrics) => (
                  <>
                    <TableCell className='font-mono'>{metrics.globalValue.minValue}</TableCell>
                    <TableCell className='font-mono'>{metrics.globalValue.maxValue}</TableCell>
                    <TableCell className='font-mono'>{metrics.globalValue.medianValue}</TableCell>
                    <TableCell className='font-mono'>{metrics.globalValue.averageValue}</TableCell>
                    <TableCell className='font-mono'>{metrics.globalCount}</TableCell>
                    <TableCell className='font-mono'>{metrics.globalValue.averageChange}</TableCell>
                  </>
                )}
              </TableBody>
            </Table>
          }
          {!metrics && <div><Loading size={32} thickness={180} /></div>}

          <SecondaryTitle>Player metrics</SecondaryTitle>
          {metrics &&
            <Table columns={['Min value', 'Max value', 'Median value', 'Average value']}>
              <TableBody iterator={[metrics]}>
                {(metrics) => (
                  <>
                    <TableCell className='font-mono'>{metrics.playerValue.minValue}</TableCell>
                    <TableCell className='font-mono'>{metrics.playerValue.maxValue}</TableCell>
                    <TableCell className='font-mono'>{metrics.playerValue.medianValue}</TableCell>
                    <TableCell className='font-mono'>{metrics.playerValue.averageValue}</TableCell>
                  </>
                )}
              </TableBody>
            </Table>
          }
          {!metrics && <div><Loading size={32} thickness={180} /></div>}
        </>
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
