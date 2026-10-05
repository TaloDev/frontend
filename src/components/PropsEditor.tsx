import { IconChevronUp, IconPlus, IconTrash } from '@tabler/icons-react'
import clsx from 'clsx'
import { ReactNode, useMemo, useState } from 'react'
import type { Prop } from '../entities/prop'
import { isMetaProp, metaPropKeyMap } from '../constants/metaProps'
import buildError from '../utils/buildError'
import Button from './Button'
import ErrorMessage, { TaloError } from './ErrorMessage'
import SecondaryTitle from './SecondaryTitle'
import Table from './tables/Table'
import TableBody from './tables/TableBody'
import TableCell from './tables/TableCell'
import TextInput from './TextInput'

type PropsEditorProps = {
  startingProps: Prop[]
  onSave: (props: Prop[]) => Promise<Prop[]>
  noPropsMessage: ReactNode
}

type MetaProp = {
  key: keyof typeof metaPropKeyMap
  value: string
}

type IndexedProp = {
  prop: Prop
  idx: number
}

type PropsRow = {
  key: string
  isArray: boolean
  entries: IndexedProp[]
}

const ARRAY_KEY_SUFFIX = '[]'

function isArrayKey(key: string): boolean {
  return key.endsWith(ARRAY_KEY_SUFFIX)
}

function stringifyPropValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value)
}

function itemCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'item' : 'items'}`
}

// props arrays are written as:
// {"weapons[]": ["sword", "axe"]} -> two weapons[] props
function expandBulkProp(key: string, value: unknown): Prop[] {
  if (!Array.isArray(value) || !isArrayKey(key)) {
    return [{ key, value: stringifyPropValue(value) }]
  }

  return value.map((entry) => ({ key, value: stringifyPropValue(entry) }))
}

function groupPropRows(entries: IndexedProp[]): PropsRow[] {
  const rows: PropsRow[] = []
  const arrayRows = new Map<string, PropsRow>()

  for (const entry of entries) {
    const { key } = entry.prop
    const arrayRow = isArrayKey(key) ? arrayRows.get(key) : undefined

    if (arrayRow) {
      arrayRow.entries.push(entry)
      continue
    }

    const row = { key, isArray: isArrayKey(key), entries: [entry] }
    if (row.isArray) {
      arrayRows.set(key, row)
    }

    rows.push(row)
  }

  return rows
}

export default function PropsEditor({ startingProps, onSave, noPropsMessage }: PropsEditorProps) {
  const [originalProps, setOriginalProps] = useState<Prop[]>(startingProps)
  const [props, setProps] = useState<Prop[]>(originalProps)
  const [bulkPropsList, setBulkPropsList] = useState<string>('')
  const [newProps, setNewProps] = useState<Prop[]>([])
  const [error, setError] = useState<TaloError | null>(null)
  const [isUpdating, setUpdating] = useState(false)
  const [collapsedArrays, setCollapsedArrays] = useState<Set<string>>(new Set())

  const editExistingProp = (idx: number, value: string | null) => {
    setProps((curr) => curr.map((prop, currIdx) => (currIdx === idx ? { ...prop, value } : prop)))
  }

  const toggleArray = (key: string) => {
    setCollapsedArrays((curr) => {
      const next = new Set(curr)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      return next
    })
  }

  const deleteArray = (entries: IndexedProp[]) => {
    const idxs = new Set(entries.map(({ idx }) => idx))

    setProps((curr) => curr.map((prop, idx) => (idxs.has(idx) ? { ...prop, value: null } : prop)))
  }

  const addNewProp = () => {
    setNewProps([...newProps, { key: '', value: '' }])
  }

  const editNewPropKey = (idx: number, key: string) => {
    const updatedProps = [...newProps]
    updatedProps[idx].key = key
    setNewProps(updatedProps)
  }

  const editNewPropValue = (idx: number, value: string) => {
    const updatedProps = [...newProps]
    updatedProps[idx].value = value
    setNewProps(updatedProps)
  }

  const deleteNewProp = (newPropIdx: number) => {
    setNewProps(newProps.filter((_, idx) => idx !== newPropIdx))
  }

  const enableResetButton = useMemo(() => {
    if (newProps.length > 0 || bulkPropsList) return true
    if (originalProps.length !== props.length) return true

    return originalProps.some((prop, idx) => {
      return prop.value !== props[idx].value
    })
  }, [bulkPropsList, newProps.length, originalProps, props])

  const enableSaveButton = useMemo(() => {
    return newProps.every((prop) => prop.key && prop.value)
  }, [newProps])

  const reset = () => {
    setProps(originalProps)
    setNewProps([])
    setBulkPropsList('')
  }

  const parseBulkPropsList = () => {
    if (!bulkPropsList) {
      return
    }

    try {
      const parsed = JSON.parse(bulkPropsList)
      const bulkProps = Object.entries(parsed).flatMap(([key, value]) => expandBulkProp(key, value))
      const bulkByKey = new Map<string, Prop[]>()

      bulkProps.forEach((prop) => {
        bulkByKey.set(prop.key, [...(bulkByKey.get(prop.key) ?? []), prop])
      })

      const arrayKeys = new Set([...bulkByKey.keys()].filter(isArrayKey))

      // replace array props wholesale so imported arrays group like saved ones
      setProps((curr) => [
        ...curr
          .filter((prop) => !arrayKeys.has(prop.key))
          .map((prop) => bulkByKey.get(prop.key)?.[0] ?? prop),
        ...[...arrayKeys].flatMap((key) => bulkByKey.get(key) ?? []),
      ])

      setNewProps((curr) => {
        const kept = curr
          .filter((prop) => !arrayKeys.has(prop.key))
          .map((prop) => bulkByKey.get(prop.key)?.[0] ?? prop)
        const taken = new Set([...props, ...kept].map((prop) => prop.key))

        return [
          ...kept,
          ...bulkProps.filter((prop) => !isArrayKey(prop.key) && !taken.has(prop.key)),
        ]
      })

      setBulkPropsList('')
      setError(null)
    } catch (err) {
      setError(buildError(err))
    }
  }

  const save = async () => {
    setUpdating(true)
    setError(null)

    const propsToSend = [...props, ...newProps].filter((prop) => !isMetaProp(prop))

    try {
      const updatedOriginalProps = await onSave(propsToSend)
      setOriginalProps(updatedOriginalProps)
      setProps(updatedOriginalProps)
      setNewProps([])
    } catch (err) {
      setError(buildError(err))
    } finally {
      setUpdating(false)
    }
  }

  const existingProps: IndexedProp[] = props
    .map((prop, idx) => ({ prop, idx }))
    .filter(({ prop }) => prop.value !== null && !isMetaProp(prop))
    .sort((a, b) => a.prop.key.localeCompare(b.prop.key))

  const propRows = groupPropRows(existingProps)

  const metaProps = props
    .filter((prop) => isMetaProp(prop))
    .sort((a, b) => a.key.localeCompare(b.key))

  return (
    <>
      <div className='space-y-4'>
        {metaProps.length > 0 && (
          <>
            <SecondaryTitle>Talo props</SecondaryTitle>
            <Table columns={['Key', 'Value', '']}>
              <TableBody
                iterator={metaProps}
                configureClassnames={(prop, idx) => ({
                  'bg-orange-600': prop.key === 'META_DEV_BUILD' && idx % 2 !== 0,
                  'bg-orange-500': prop.key === 'META_DEV_BUILD' && idx % 2 === 0,
                })}
              >
                {(prop) => (
                  <>
                    <TableCell className='min-w-80'>
                      {metaPropKeyMap[(prop as MetaProp).key]}
                    </TableCell>
                    <TableCell className='min-w-80'>{prop.value}</TableCell>
                    <TableCell />
                  </>
                )}
              </TableBody>
            </Table>
          </>
        )}

        {existingProps.length + newProps.length === 0 && noPropsMessage}

        {existingProps.length + newProps.length > 0 && (
          <>
            {metaProps.length > 0 && <SecondaryTitle>Your props</SecondaryTitle>}
            <Table columns={['Key', 'Value']}>
              <TableBody iterator={propRows}>
                {(row) => {
                  const isCollapsed = row.isArray && collapsedArrays.has(row.key)
                  const itemCount = itemCountLabel(row.entries.length)

                  return (
                    <>
                      <TableCell className={clsx('min-w-80', { 'align-top': row.isArray })}>
                        {row.key}
                      </TableCell>

                      <TableCell className='min-w-80'>
                        {row.isArray && (
                          <div className='flex items-center space-x-2 text-white'>
                            <Button
                              variant='bare'
                              className='flex items-center space-x-2'
                              onClick={() => toggleArray(row.key)}
                              extra={{
                                'aria-label': `${isCollapsed ? 'Expand' : 'Collapse'} ${row.key} (${itemCount})`,
                                'aria-expanded': !isCollapsed,
                              }}
                            >
                              <span>{itemCount}</span>

                              <span className='flex rounded-full bg-indigo-900 p-1'>
                                <IconChevronUp
                                  size={16}
                                  className={clsx({ 'rotate-180': isCollapsed })}
                                />
                              </span>
                            </Button>

                            <Button
                              variant='icon'
                              className='rounded-full bg-indigo-900 p-1'
                              onClick={() => deleteArray(row.entries)}
                              icon={<IconTrash size={16} />}
                              extra={{ 'aria-label': `Delete all ${row.key} props` }}
                            />
                          </div>
                        )}

                        {!isCollapsed && (
                          <div className={clsx('space-y-2', { 'mt-4': row.isArray })}>
                            {row.entries.map(({ prop, idx: propIdx }) => (
                              <div key={propIdx} className='flex items-center space-x-2'>
                                <div className='grow'>
                                  <TextInput
                                    id={`edit-${propIdx}`}
                                    variant='light'
                                    placeholder='Value'
                                    onChange={(value: string) => editExistingProp(propIdx, value)}
                                    value={prop.value ?? ''}
                                  />
                                </div>

                                <Button
                                  variant='icon'
                                  className='rounded-full bg-indigo-900 p-1'
                                  onClick={() => editExistingProp(propIdx, null)}
                                  icon={<IconTrash size={16} />}
                                  extra={{ 'aria-label': `Delete ${prop.key} prop` }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </>
                  )
                }}
              </TableBody>
              <TableBody iterator={newProps} startIdx={propRows.length}>
                {(prop, idx) => (
                  <>
                    <TableCell className='min-w-80'>
                      <TextInput
                        id={`edit-key-${idx}`}
                        variant='light'
                        placeholder='Property'
                        onChange={(value: string) => editNewPropKey(idx, value)}
                        value={prop.key}
                      />
                    </TableCell>
                    <TableCell className='min-w-80'>
                      <div className='flex items-center space-x-2'>
                        <div className='grow'>
                          <TextInput
                            id={`edit-value-${idx}`}
                            variant='light'
                            placeholder='Value'
                            onChange={(value: string) => editNewPropValue(idx, value)}
                            value={prop.value ?? ''}
                          />
                        </div>

                        <Button
                          variant='icon'
                          className='rounded-full bg-indigo-900 p-1'
                          onClick={() => deleteNewProp(idx)}
                          icon={<IconTrash size={16} />}
                          extra={{ 'aria-label': `Delete ${prop.key} prop` }}
                        />
                      </div>
                    </TableCell>
                  </>
                )}
              </TableBody>
            </Table>
          </>
        )}

        <Button onClick={addNewProp} icon={<IconPlus size={16} />}>
          <span>New property</span>
        </Button>
      </div>

      <div className='space-y-4'>
        <label className='block font-semibold' htmlFor='bulk-props'>
          Import props
        </label>

        <TextInput
          id='bulk-props'
          variant='light'
          inputType='textarea'
          placeholder='{"key1": "value1", "weapons[]": ["sword", "axe"]}'
          onChange={(value: string) => setBulkPropsList(value)}
          value={bulkPropsList ?? ''}
        />

        <Button onClick={parseBulkPropsList} disabled={!bulkPropsList}>
          Parse JSON
        </Button>
      </div>

      {error && <ErrorMessage error={error} />}

      <div className='flex space-x-4'>
        <Button variant='grey' disabled={!enableResetButton} onClick={reset}>
          Reset
        </Button>

        <Button
          variant='green'
          disabled={!enableResetButton || !enableSaveButton}
          onClick={save}
          isLoading={isUpdating}
        >
          Save changes
        </Button>
      </div>
    </>
  )
}
