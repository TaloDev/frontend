import React, { useState } from 'react'
import Page from '../components/Page'
import { useLocation } from 'react-router-dom'
import { IconPlus, IconTrash } from '@tabler/icons'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import updatePlayer from '../api/updatePlayer'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import Loading from '../components/Loading'
import isEqual from 'lodash.isequal'
import classNames from 'classnames'
import PlayerIdentifier from '../components/PlayerIdentifier'
import usePlayer from '../utils/usePlayer'
import Table from '../components/tables/Table'

const PlayerProps = () => {
  const location = useLocation()

  const [originalPlayer, setOriginalPlayer] = useState(location.state?.player)
  const [player, setPlayer] = usePlayer({
    onLoaded: (player) => setOriginalPlayer(player)
  })

  const [newProps, setNewProps] = useState([])
  const [error, setError] = useState(null)
  const [isUpdating, setUpdating] = useState(false)

  const editExistingProp = (key, value) => {
    const props = player.props.map((prop) => {
      if (prop.key === key) return {
        ...prop,
        value
      }

      return prop
    })

    setPlayer({
      ...player,
      props
    })
  }

  const deleteExistingProp = (key) => {
    const props = player.props.map((prop) => {
      if (prop.key === key) return {
        ...prop,
        value: null
      }

      return prop
    })

    setPlayer({
      ...player,
      props
    })
  }

  const addNewProp = () => {
    setNewProps([
      ...newProps,
      {
        key: '',
        value: ''
      }
    ])
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

  const reset = () => {
    setPlayer(originalPlayer)
    setNewProps([])
  }

  const save = async () => {
    setUpdating(true)
    setError(null)

    const props = [
      ...player.props,
      ...newProps
    ].filter((prop) => !prop.key.startsWith('META_'))

    try {
      const res = await updatePlayer(player.id, { props })
      setPlayer(res.data.player)
      setOriginalPlayer(res.data.player)
      setNewProps(newProps.filter((newProp) => newProp.key.length === 0))
    } catch (err) {
      setError(buildError(err))
    } finally {
      setUpdating(false)
    }
  }

  if (!player) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  const existingProps = player.props
    .filter((prop) => prop.value !== null)
    .sort((a, b) => a.key.startsWith('META_') ? -1 : a.key.localeCompare(b.key))

  return (
    <Page
      showBackButton
      containerClassName='w-full lg:w-1/2'
      title='Player properties'
    >
      <PlayerIdentifier player={player} />

      {existingProps.length + newProps.length === 0 &&
        <p>This player has no custom properties. Click the button below to add one.</p>
      }

      {existingProps.length + newProps.length > 0 &&
        <Table columns={['Property', 'Value', '']}>
          <TableBody
            iterator={existingProps}
            configureClassNames={(prop, idx) => ({
              'bg-orange-600': prop.key.startsWith('META_') && idx % 2 !== 0,
              'bg-orange-500': prop.key.startsWith('META_') && idx % 2 === 0
            })}
          >
            {(prop) => (
              <>
                <TableCell className={classNames('min-w-80', { '!rounded-bl-none': newProps.length > 0 })}>{prop.key}</TableCell>
                <TableCell className='min-w-80'>
                  <TextInput
                    id={`edit-${prop.key}`}
                    disabled={prop.key.startsWith('META_')}
                    variant='light'
                    placeholder='Value'
                    onChange={(value) => editExistingProp(prop.key, value)}
                    value={prop.value}
                  />
                </TableCell>
                <TableCell className={classNames({ '!rounded-br-none': newProps.length > 0 })}>
                  {!prop.key.startsWith('META_') &&
                    <Button
                      variant='icon'
                      className='p-1 rounded-full bg-indigo-900 ml-auto'
                      onClick={() => deleteExistingProp(prop.key)}
                      icon={<IconTrash size={16} />}
                      extra={{ 'aria-label': `Delete ${prop.key} prop` }}
                    />
                  }
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
        <Button variant='grey' disabled={isEqual(player, originalPlayer) && newProps.length === 0} onClick={reset}>
          Reset
        </Button>

        <Button variant='green' onClick={save} isLoading={isUpdating}>
          Save changes
        </Button>
      </div>
    </Page>
  )
}

export default PlayerProps
