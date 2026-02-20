import { IconPlus, IconTrash } from '@tabler/icons-react'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
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
  noPropsMessage: string
}

type MetaProp = {
  key: keyof typeof metaPropKeyMap
  value: string
}

export default function PropsEditor({ startingProps, onSave, noPropsMessage }: PropsEditorProps) {
  const [originalProps, setOriginalProps] = useState<Prop[]>(startingProps)
  const [props, setProps] = useState<Prop[]>(originalProps)
  const [bulkPropsList, setBulkPropsList] = useState<string>('')
  const [newProps, setNewProps] = useState<Prop[]>([])
  const [error, setError] = useState<TaloError | null>(null)
  const [isUpdating, setUpdating] = useState(false)

  const editExistingProp = (key: string, value: string | null) => {
    setProps((curr) => {
      return curr.map((prop): Prop => {
        if (prop.key === key) return { ...prop, value }
        return prop
      })
    })
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

    return originalProps.some((prop, idx) => {
      return prop.value !== props[idx].value
    })
  }, [bulkPropsList, newProps.length, originalProps, props])

  const enableSaveButton = useMemo(() => {
    return (
      newProps.every((prop) => prop.key && prop.value) && props.every((prop) => prop.value !== '')
    )
  }, [newProps, props])

  const reset = () => {
    setProps(originalProps)
    setNewProps([])
    setBulkPropsList('')
  }

  const parseBulkPropsList = () => {
    if (bulkPropsList) {
      try {
        const parsed = JSON.parse(bulkPropsList)
        const bulkprops = Object.entries(parsed).map(([key, value]) => ({
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
        }))
        newProps.push(...bulkprops)
        setNewProps(newProps)
        setBulkPropsList('')
        setError(null)
      } catch (err) {
        setError(buildError(err))
      }
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

  const existingProps = props
    .filter((prop) => prop.value !== null && !isMetaProp(prop))
    .sort((a, b) => a.key.localeCompare(b.key))

  const metaProps = props
    .filter((prop) => isMetaProp(prop))
    .sort((a, b) => a.key.localeCompare(b.key))

  return (
    <>
      <div className='space-y-4'>
        {metaProps.length > 0 && (
          <>
            <SecondaryTitle>Talo props</SecondaryTitle>
            <Table columns={['Property', 'Value', '']}>
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

        {existingProps.length + newProps.length === 0 && (
          <p>{noPropsMessage}. Click the button below to add one.</p>
        )}

        {existingProps.length + newProps.length > 0 && (
          <>
            {metaProps.length > 0 && <SecondaryTitle>Your props</SecondaryTitle>}
            <Table columns={['Property', 'Value', '']}>
              <TableBody iterator={existingProps}>
                {(prop) => (
                  <>
                    <TableCell
                      className={clsx('min-w-80', { '!rounded-bl-none': newProps.length > 0 })}
                    >
                      {prop.key}
                    </TableCell>
                    <TableCell className='min-w-80'>
                      <TextInput
                        id={`edit-${prop.key}`}
                        variant='light'
                        placeholder='Value'
                        onChange={(value: string) => editExistingProp(prop.key, value)}
                        value={prop.value ?? ''}
                      />
                    </TableCell>
                    <TableCell className={clsx({ '!rounded-br-none': newProps.length > 0 })}>
                      <Button
                        variant='icon'
                        className='ml-auto rounded-full bg-indigo-900 p-1'
                        onClick={() => editExistingProp(prop.key, null)}
                        icon={<IconTrash size={16} />}
                        extra={{ 'aria-label': `Delete ${prop.key} prop` }}
                      />
                    </TableCell>
                  </>
                )}
              </TableBody>
              <TableBody iterator={newProps} startIdx={existingProps.length}>
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
                      <TextInput
                        id={`edit-value-${idx}`}
                        variant='light'
                        placeholder='Value'
                        onChange={(value: string) => editNewPropValue(idx, value)}
                        value={prop.value ?? ''}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='icon'
                        className='ml-auto rounded-full bg-indigo-900 p-1'
                        onClick={() => deleteNewProp(idx)}
                        icon={<IconTrash size={16} />}
                        extra={{ 'aria-label': `Delete ${prop.key} prop` }}
                      />
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
          placeholder='{"key1": "value1", "key2": "value2"}'
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
