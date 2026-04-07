import { IconCircleCheckFilled, IconCircleXFilled } from '@tabler/icons-react'
import clsx from 'clsx'
import { parse } from 'csv-parse/browser/esm/sync'
import { useContext, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { KeyedMutator } from 'swr'
import bulkCreateStats from '../api/bulkCreateStats'
import Button from '../components/Button'
import { TaloError } from '../components/ErrorMessage'
import FileUpload from '../components/FileUpload'
import Loading from '../components/Loading'
import Modal from '../components/Modal'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { GameStat } from '../entities/gameStat'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

type BulkCreateStatsProps = {
  modalState: [boolean, (goBack: boolean) => void]
  mutate: KeyedMutator<{ stats: GameStat[] }>
}

type ParsedRow = {
  internalName: string
  name: string
  global: boolean
  defaultValue: number
  minValue: number | null
  maxValue: number | null
  maxChange: number | null
  minTimeBetweenUpdates: number
}

type RowResult = {
  internalName: string
  errors: string[]
}

type RawRow = Record<string, string>

const sampleCSV = [
  'internalName,name,defaultValue,global,minValue,maxValue,maxChange,minTimeBetweenUpdates',
  'kills,Kills,0,false,,,,',
  'deaths,Deaths,0,false,0,,,60',
  'score,Score,0,true,0,10000,,',
].join('\n')

function parseCSV(text: string): { rows: ParsedRow[]; parseErrors: string[] } {
  let rawRows: RawRow[]
  try {
    rawRows = parse(text, {
      columns: (headers: string[]) => headers.map((h) => h.trim().toLowerCase()),
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as RawRow[]
  } catch (err) {
    return { rows: [], parseErrors: [(err as Error).message] }
  }

  if (rawRows.length === 0) {
    return { rows: [], parseErrors: ['CSV must have a header row and at least one data row'] }
  }

  const required = ['internalname', 'name', 'defaultvalue']
  const missing = required.filter((col) => !(col in rawRows[0]))
  if (missing.length > 0) {
    return { rows: [], parseErrors: [`Missing required columns: ${missing.join(', ')}`] }
  }

  const rows: ParsedRow[] = []
  const parseErrors: string[] = []

  const toNullableNumber = (
    val: string,
    displayName: string,
    rowNum: number,
  ): number | null | 'error' => {
    if (!val) {
      return null
    }

    const n = Number(val)
    if (isNaN(n)) {
      parseErrors.push(`Row ${rowNum}: ${displayName} must be a number`)
      return 'error'
    }

    return n
  }

  rawRows.forEach((raw, idx) => {
    const rowNum = idx + 1
    const internalName = raw['internalname']
    const name = raw['name']
    const defaultValueStr = raw['defaultvalue']

    if (!internalName || !name || !defaultValueStr) {
      parseErrors.push(`Row ${rowNum}: internalName, name, and defaultValue are required`)
      return
    }

    const defaultValue = Number(defaultValueStr)
    if (isNaN(defaultValue)) {
      parseErrors.push(`Row ${rowNum}: defaultValue must be a number`)
      return
    }

    const minValue = toNullableNumber(raw['minvalue'], 'minValue', rowNum)
    const maxValue = toNullableNumber(raw['maxvalue'], 'maxValue', rowNum)
    const maxChange = toNullableNumber(raw['maxchange'], 'maxChange', rowNum)

    const minTimeBetweenUpdatesStr = raw['mintimebetweenupdates']
    const minTimeBetweenUpdates = minTimeBetweenUpdatesStr ? Number(minTimeBetweenUpdatesStr) : 0
    if (minTimeBetweenUpdatesStr && isNaN(minTimeBetweenUpdates)) {
      parseErrors.push(`Row ${rowNum}: minTimeBetweenUpdates must be a number`)
      return
    }

    if (minValue === 'error' || maxValue === 'error' || maxChange === 'error') return

    rows.push({
      internalName,
      name,
      global: raw['global']?.toLowerCase() === 'true',
      defaultValue,
      minValue,
      maxValue,
      maxChange,
      minTimeBetweenUpdates,
    })
  })

  return { rows, parseErrors }
}

export function BulkCreateStats({ modalState, mutate }: BulkCreateStatsProps) {
  const [, goBack] = modalState
  const [isLoading, setLoading] = useState(false)
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [results, setResults] = useState<RowResult[] | null>(null)
  const [parsedRows, setParsedRows] = useState<ParsedRow[] | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const toast = useContext(ToastContext)

  const onDownloadSample = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stats-sample.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const onFileChange = (file: File) => {
    setParseErrors([])
    setResults(null)
    setParsedRows(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { rows, parseErrors: errors } = parseCSV(text)
      if (errors.length > 0) {
        setParseErrors(errors)
      } else {
        setParsedRows(rows)
      }
    }
    reader.readAsText(file)
  }

  const onImportClick = async () => {
    if (!parsedRows) {
      return
    }

    setLoading(true)
    setResults(null)

    try {
      const { stats: createdStats, errors } = await bulkCreateStats(activeGame.id, parsedRows)

      const rowResults: RowResult[] = parsedRows.map((row, i) => ({
        internalName: row.internalName,
        errors: errors[i] ?? [],
      }))

      if (createdStats.length > 0) {
        await mutate(
          (data) => ({ ...data, stats: [...(data?.stats ?? []), ...createdStats] }),
          false,
        )
      }

      setResults(rowResults)

      const successCount = rowResults.filter((r) => r.errors.length === 0).length
      if (successCount > 0) {
        toast.trigger(
          `${successCount} ${successCount === 1 ? 'stat' : 'stats'} created`,
          ToastType.SUCCESS,
        )
      }
    } catch (err) {
      const taloError = buildError(err) as TaloError
      setParseErrors([taloError.message])
    } finally {
      setLoading(false)
    }
  }

  const onFileUploadClear = () => {
    setParseErrors([])
    setResults(null)
    setParsedRows(null)
  }

  const successCount = results?.filter((r) => r.errors.length === 0).length ?? 0
  const errorCount = results?.filter((r) => r.errors.length > 0).length ?? 0

  return (
    <Modal
      id='bulk-create-stats'
      title='Bulk import stats'
      modalState={[true, () => goBack(!!results)]}
    >
      <div className='space-y-4 p-4'>
        <p>Upload a CSV file to create multiple stats at once.</p>
        <div>
          <div className='mb-2 flex items-center justify-between'>
            <p className='font-semibold'>Columns guide</p>
            <button
              type='button'
              className='text-xs text-indigo-600 underline hover:text-indigo-800'
              onClick={onDownloadSample}
            >
              Download sample
            </button>
          </div>
          <div className='overflow-hidden rounded border border-gray-300'>
            <table className='w-full border-separate border-spacing-0 text-xs'>
              <thead>
                <tr className='bg-gray-100 text-left'>
                  <th className='border-r border-b border-gray-300 p-2 font-semibold'>Column</th>
                  <th className='border-r border-b border-gray-300 p-2 font-semibold'>Required</th>
                  <th className='border-b border-gray-300 p-2 font-semibold'>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['internalName', true, 'Unique identifier (cannot be changed later)'],
                  ['name', true, 'Display name shown to players'],
                  ['defaultValue', true, 'Starting value for the stat'],
                  ['global', false, 'true or false - aggregates all players (default: false)'],
                  ['minValue', false, 'Lowest allowed value (leave blank for none)'],
                  ['maxValue', false, 'Highest allowed value (leave blank for none)'],
                  ['maxChange', false, 'Max amount a single update can change the value'],
                  ['minTimeBetweenUpdates', false, 'Minimum seconds between updates (default: 0)'],
                ].map(([col, required, desc], rowIdx, arr) => (
                  <tr key={col as string}>
                    <td
                      className={clsx('border-r border-gray-300 p-2 font-mono', {
                        'border-b': rowIdx < arr.length - 1,
                      })}
                    >
                      {col as string}
                    </td>
                    <td
                      className={clsx('border-r border-gray-300 p-2', {
                        'border-b': rowIdx < arr.length - 1,
                      })}
                    >
                      {required ? 'Yes' : 'No'}
                    </td>
                    <td
                      className={clsx('p-2', {
                        'border-b border-gray-300': rowIdx < arr.length - 1,
                      })}
                    >
                      {desc as string}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {!isLoading && !results && (
          <FileUpload
            label='File upload'
            accept='.csv'
            onChange={onFileChange}
            onClear={onFileUploadClear}
          />
        )}

        {parseErrors.length > 0 && (
          <div className='space-y-1'>
            {parseErrors.map((err, i) => (
              <p key={i} role='alert' className='text-sm font-medium text-red-500'>
                {err}
              </p>
            ))}
          </div>
        )}

        {parsedRows && !isLoading && !results && (
          <p className='-mt-2'>
            {new Intl.NumberFormat().format(parsedRows.length)}{' '}
            {parsedRows.length === 1 ? 'row' : 'rows'} ready to import
          </p>
        )}

        {isLoading && (
          <div className='flex items-center gap-2'>
            <Loading size={24} />
            <span>Importing…</span>
          </div>
        )}

        {results && (
          <div>
            <p className='font-semibold'>Results</p>
            <div className='mt-2 space-y-4'>
              <div className='flex space-x-2'>
                <span className='flex items-center gap-1'>
                  <IconCircleCheckFilled className='text-green-600' />
                  <span>
                    {new Intl.NumberFormat().format(successCount)}{' '}
                    {successCount === 1 ? 'row' : 'rows'} imported
                  </span>
                </span>
                {errorCount > 0 && (
                  <span className='flex items-center gap-1'>
                    <IconCircleXFilled className='text-red-500' />
                    <span>
                      {new Intl.NumberFormat().format(errorCount)}{' '}
                      {errorCount === 1 ? 'row' : 'rows'} not imported:
                    </span>
                  </span>
                )}
              </div>

              {errorCount > 0 && (
                <div className='max-h-48 overflow-y-auto rounded border border-red-400 bg-red-50 p-4'>
                  <ul className='space-y-2 text-sm'>
                    {results
                      .filter((row) => row.errors.length > 0)
                      .map((row, rowIdx) => (
                        <li key={rowIdx} className='text-red-600'>
                          <span className='font-mono font-semibold'>{row.internalName}</span>
                          <ul className='list-disc pl-6'>
                            {row.errors.map((error, errorIdx) => (
                              <li key={errorIdx}>{error}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className={clsx(
          'flex flex-col space-y-4 border-t border-gray-300 p-4 md:flex-row-reverse md:justify-between md:space-y-0',
        )}
      >
        <div
          className={clsx('w-full', {
            'md:w-44': results,
            'md:w-32': !results,
          })}
        >
          {results ? (
            <Button type='button' className='whitespace-nowrap' onClick={onFileUploadClear}>
              Upload another file
            </Button>
          ) : (
            <Button type='button' disabled={!parsedRows || isLoading} onClick={onImportClick}>
              Import
            </Button>
          )}
        </div>
        <div className='w-full md:w-32'>
          <Button type='button' variant='grey' onClick={() => goBack(!!results)}>
            {results ? 'Close' : 'Back'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
