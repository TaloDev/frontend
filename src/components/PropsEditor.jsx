import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { IconPlus, IconTrash } from '@tabler/icons'
import Button from './Button'
import TextInput from './TextInput'
import ErrorMessage from './ErrorMessage'
import buildError from '../utils/buildError'
import TableCell from './tables/TableCell'
import TableBody from './tables/TableBody'
import classNames from 'classnames'
import Table from './tables/Table'
import SecondaryTitle from './SecondaryTitle'
import { isMetaProp, metaPropKeyMap } from '../constants/metaProps'

export default function PropsEditor({ startingProps, onSave, noPropsMessage }) {
  const [originalProps, setOriginalProps] = useState(startingProps)
  const [props, setProps] = useState(originalProps)

  const [newProps, setNewProps] = useState([])
  const [error, setError] = useState(null)
  const [isUpdating, setUpdating] = useState(false)

  const editExistingProp = (key, value) => {
    setProps((curr) => {
      return curr.map((prop) => {
        if (prop.key === key) return { ...prop, value }
        return prop
      })
    })
  }

  const addNewProp = () => {
    setNewProps([...newProps, { key: '', value: '' }])
  }

  const editNewPropKey = (idx, key) => {
    const updatedProps = [...newProps]
    updatedProps[idx].key = key
    setNewProps(updatedProps)
  }

  const editNewPropValue = (idx, value) => {
    const updatedProps = [...newProps]
    updatedProps[idx].value = value
    setNewProps(updatedProps)
  }

  const deleteNewProp = (newPropIdx) => {
    setNewProps(newProps.filter((_, idx) => idx !== newPropIdx))
  }

  const enableResetButton = useMemo(() => {
    if (newProps.length > 0) return true

    return originalProps.some((prop, idx) => {
      return prop.value !== props[idx].value
    })
  }, [newProps, originalProps, props])

  const enableSaveButton = useMemo(() => {
    // eslint-disable-next-line react/prop-types
    return newProps.every((prop) => prop.key && prop.value) && props.every((prop) => prop.value !== '')
  }, [newProps, props])

  const reset = () => {
    setProps(originalProps)
    setNewProps([])
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
              configureClassNames={(prop, idx) => ({
                'bg-orange-600': prop.key === 'META_DEV_BUILD' && idx % 2 !== 0,
                'bg-orange-500': prop.key === 'META_DEV_BUILD' && idx % 2 === 0
              })}
            >
              {(prop) => (
                <>
                  <TableCell className='min-w-80'>{metaPropKeyMap[prop.key]}</TableCell>
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
                  <TableCell className={classNames('min-w-80', { '!rounded-bl-none': newProps.length > 0 })}>{prop.key}</TableCell>
                  <TableCell className='min-w-80'>
                    <TextInput
                      id={`edit-${prop.key}`}
                      variant='light'
                      placeholder='Value'
                      onChange={(value) => editExistingProp(prop.key, value)}
                      value={prop.value}
                    />
                  </TableCell>
                  <TableCell className={classNames({ '!rounded-br-none': newProps.length > 0 })}>
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
                      onChange={(value) => editNewPropKey(idx, value)}
                      value={prop.key}
                    />
                  </TableCell>
                  <TableCell className='min-w-80'>
                    <TextInput
                      id={`edit-value-${idx}`}
                      variant='light'
                      placeholder='Value'
                      onChange={(value) => editNewPropValue(idx, value)}
                      value={prop.value}
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

PropsEditor.propTypes = {
  startingProps: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired,
  onSave: PropTypes.func.isRequired,
  noPropsMessage: PropTypes.string.isRequired
}
