import React, { useState } from 'react'
import Title from '../components/Title'
import { useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { IconPlus, IconTrash } from '@tabler/icons'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import updatePlayer from '../api/updatePlayer'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'

const PlayerProps = () => {
  const location = useLocation()
  const [originalPlayer, setOriginalPlayer] = useState(location.state.player)
  const [player, setPlayer] = useState(location.state.player)
  const [newProps, setNewProps] = useState([])
  const [error, setError] = useState(null)
  const [isUpdating, setUpdating] = useState(false)

  const editExistingProp = (key, value) => {
    setPlayer({
      ...player,
      props: {
        ...player.props,
        [key]: value
      }
    })
  }

  const deleteExistingProp = (key) => {
    const playerProps = { ...player.props }
    playerProps[key] = null

    setPlayer({
      ...player,
      props: {
        ...playerProps
      }
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

    let playerProps = { ...player.props }
    for (let newProp of newProps) {
      if (newProp.key.length > 0) {
        playerProps[newProp.key] = newProp.value
      }
    }

    try {
      const res = await updatePlayer(player.id, { props: playerProps })
      setPlayer(res.data.player)
      setOriginalPlayer(res.data.player)
      setNewProps(newProps.filter((newProp) => newProp.key.length === 0))
    } catch (err) {
      setError(buildError(err))
    } finally {
      setUpdating(false)
    }
  }

  const listItemStyle = (idx) => {
    return classNames('flex items-center p-4 space-x-8', { 'bg-indigo-600': idx % 2 !== 0, 'bg-indigo-500': idx % 2 === 0 })
  }

  return (
    <div className='space-y-4 md:space-y-8'>
      <Title showBackButton>Player properties</Title>

      <div>
        Showing properties for <code className='bg-gray-900 rounded p-2 ml-1 text-sm'>{player.id}</code>
      </div>

      <div className='w-full lg:w-1/2'>
        <ul className='rounded overflow-hidden'>
          <li className='flex p-4 bg-white text-black'>
            <p className='font-semibold w-1/3'>Property</p>
            <p className='font-semibold w-1/3'>Value</p>
            <span className='w-1/3' />
          </li>

          {Object.keys(player.props).filter((key) => player.props[key] !== null).sort((a, b) => {
            return a.localeCompare(b)
          }).map((key, idx) => (
            <li key={key} className={listItemStyle(idx)}>
              <p className='w-1/3'>{key}</p>

              <span className='w-1/3'>
                <TextInput
                  id={`edit-${key}`}
                  variant='light'
                  placeholder='Value'
                  onChange={(value) => editExistingProp(key, value)}
                  value={player.props[key]}
                />
              </span>

              <span className='w-1/3 text-right'>
                <Button
                  variant='icon'
                  className='p-1 rounded-full bg-indigo-900 ml-auto'
                  onClick={() => deleteExistingProp(key)}
                  icon={<IconTrash size={16} />}
                />
              </span>
            </li>
          ))}

          {newProps.map((prop, idx) => (
            <li key={idx} className={listItemStyle(idx + Object.keys(player.props).length)}>
              <span className='w-1/3'>
                <TextInput
                  id={`edit-key-${idx}`}
                  variant='light'
                  placeholder='Property'
                  onChange={(value) => editNewPropKey(idx, value)}
                  value={prop.key}
                />
              </span>

              <span className='w-1/3'>
                <TextInput
                  id={`edit-value-${idx}`}
                  variant='light'
                  placeholder='Value'
                  onChange={(value) => editNewPropValue(idx, value)}
                  value={prop.value}
                />
              </span>

              <span className='w-1/3 text-right'>
                <Button
                  variant='icon'
                  className='p-1 rounded-full bg-indigo-900 ml-auto'
                  onClick={() => deleteNewProp(idx)}
                  icon={<IconTrash size={16} />}
                />
              </span>
            </li>
          ))}
        </ul>

        <Button
          className='mt-4 justify-center'
          onClick={addNewProp}
          icon={<IconPlus size={16} />}
        >
          <span>New property</span>
        </Button>

        {error && <ErrorMessage error={error} />}

        <div className='flex space-x-4 mt-8'>
          <Button variant='grey' onClick={reset}>
            Reset
          </Button>

          <Button variant='green' onClick={save} isLoading={isUpdating}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PlayerProps
