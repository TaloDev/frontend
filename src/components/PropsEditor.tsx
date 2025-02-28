import { useMemo, useState, useRef, useEffect } from 'react'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import Button from './Button'
import TextInput from './TextInput'
import ErrorMessage, { TaloError } from './ErrorMessage'
import buildError from '../utils/buildError'
import TableCell from './tables/TableCell'
import TableBody from './tables/TableBody'
import clsx from 'clsx'
import Table from './tables/Table'
import SecondaryTitle from './SecondaryTitle'
import { isMetaProp, metaPropKeyMap } from '../constants/metaProps'
import type { Prop } from '../entities/prop'
import FileInput from './FileInput'



type PropsEditorProps = {
  startingProps: Prop[]
  onSave: (props: Prop[]) => Promise<Prop[]>
  noPropsMessage: string
}

type MetaProp = {
  key: keyof typeof metaPropKeyMap
  value: string
}

export default function PropsEditor({
  startingProps,
  onSave,
  noPropsMessage
}: PropsEditorProps) {
  const [originalProps, setOriginalProps] = useState<Prop[]>(startingProps)
  const [props, setProps] = useState<Prop[]>(originalProps)

  const [newProps, setNewProps] = useState<Prop[]>([])
  const [error, setError] = useState<TaloError | null>(null)
  const [isUpdating, setUpdating] = useState(false)

  const [showBulkProps, setShowBulkProps] = useState(false)
  const [bulkPropsList, setBulkPropsList] = useState<string>('')
  const [bulkPropsFile, setBulkPropsFile] = useState<File | null>(null)
  const [bulkPropsJson, setBulkPropsJson] = useState<object | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (newProps.length > 0 || bulkPropsList || fileInputRef.current) return true

    return originalProps.some((prop, idx) => {
      return prop.value !== props[idx].value
    })
  }, [newProps, originalProps, props])

  const enableSaveButton = useMemo(() => {
    return newProps.every((prop) => prop.key && prop.value) && props.every((prop) => prop.value !== '')
  }, [newProps, props])

  const reset = () => {
    setProps(originalProps)
    setNewProps([])
    setBulkPropsFile(null)
    setBulkPropsList('')
    if (fileInputRef.current) {fileInputRef.current.value = ''}
  }

  const handleFileChange = async (file: File) => {
    const fileExtension = file.name.split('.').pop()
    if (fileExtension !== 'json') {
      setError(buildError(new Error('File must be a JSON file')))
      setBulkPropsFile(null)
      if (fileInputRef.current) {fileInputRef.current.value = ''}
      return
    }
    setBulkPropsFile(file)
  }

  useEffect(() => {
    setError(null)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = e.target?.result as string
      try {
        const parsed = JSON.parse(text)
        setBulkPropsJson(parsed)
      } catch (err) {
        setError(buildError(err))
      }
    }
    if (bulkPropsFile) {
      reader.readAsText(bulkPropsFile)
    }
    
  }, [bulkPropsFile])

  const parseBulkPropsList = (list: string) => {
    if (list) {setBulkPropsList(list)}

      try {
        const parsed = JSON.parse(list)
        setBulkPropsJson(parsed)
      } catch (err) {
        setError(buildError(err))
      }
    }

  const setNewPropsFromJson = () => {
      if (bulkPropsJson) {
        const bulkprops = Object.entries(bulkPropsJson).map(([key, value]) => ({ key, value: typeof value === 'string' ? value : JSON.stringify(value) }))
        newProps.push(...bulkprops)
        setNewProps(newProps)}
        if (fileInputRef.current) {fileInputRef.current.value = ''}
        setBulkPropsFile(null)
        setBulkPropsList('')
        setBulkPropsJson(null)
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
    // eslint-disable-next-line react/prop-types
    .filter((prop) => prop.value !== null && !isMetaProp(prop))
    .sort((a, b) => a.key.localeCompare(b.key))

  const metaProps = props
    // eslint-disable-next-line react/prop-types
    .filter((prop) => isMetaProp(prop))
    .sort((a, b) => a.key.localeCompare(b.key))

  return (
    <>
      {metaProps.length > 0 &&
        <>
          <SecondaryTitle>Talo props</SecondaryTitle>
          <Table columns={['Property', 'Value', '']}>
            <TableBody
              iterator={metaProps}
              configureClassnames={(prop, idx) => ({
                'bg-orange-600': prop.key === 'META_DEV_BUILD' && idx % 2 !== 0,
                'bg-orange-500': prop.key === 'META_DEV_BUILD' && idx % 2 === 0
              })}
            >
              {(prop) => (
                <>
                  <TableCell className='min-w-80'>{metaPropKeyMap[(prop as MetaProp).key]}</TableCell>
                  <TableCell className='min-w-80'>{prop.value}</TableCell>
                  <TableCell />
                </>
              )}
            </TableBody>
          </Table>
        </>
      }

      {existingProps.length + newProps.length === 0 &&
        <p>{noPropsMessage}. Click the button below to add one.</p>
      }

      {existingProps.length + newProps.length > 0 &&
        <>
          {metaProps.length > 0 && <SecondaryTitle>Your props</SecondaryTitle>}
          <Table columns={['Property', 'Value', '']}>
            <TableBody iterator={existingProps}>
              {(prop) => (
                <>
                  <TableCell className={clsx('min-w-80', { '!rounded-bl-none': newProps.length > 0 })}>{prop.key}</TableCell>
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
                      className='p-1 rounded-full bg-indigo-900 ml-auto'
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
                      className='p-1 rounded-full bg-indigo-900 ml-auto'
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
      }

      <Button
        className='mt-4'
        onClick={addNewProp}
        icon={<IconPlus size={16} />}
      >
        <span>New property</span>
      </Button>
      
      <Button
        className='mt-4'
        onClick={() => setShowBulkProps(!showBulkProps)}
        icon={<IconPlus size={16} />}
      >
        <span>Add properties from file or list</span>
      </Button>
      
      {showBulkProps && <>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="bulk-props">Upload JSON file</label>
        <FileInput
            inputRef={fileInputRef}
            id='bulk-props'
            type='file'
            variant='light'
            disabled={!!bulkPropsList}
            onChange={(file: File) => handleFileChange(file)}
          /> 
      
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="bulk-props">Or paste properties</label>
          <TextInput
            id='bulk-props'
            variant='light'
            type='area'
            disabled={!!bulkPropsFile}
            placeholder='{"key1": "value1", "key2": "value2"}'
            onChange={(value: string) =>  parseBulkPropsList(value)}
            value={bulkPropsList ?? ''}
          /> 
      
  
      <div className="mt-4">
        <Button
          className='mt-4'
          onClick={setNewPropsFromJson}
          icon={<IconPlus size={16} />}
        >
          <span>Parse list</span>
        </Button>
        
      </div>
      </>}
      {error && <ErrorMessage error={error} />}

      <div className='flex space-x-4 mt-8'>
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
