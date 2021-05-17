import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { IconPlus, IconTrash } from '@tabler/icons'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import updatePlayer from '../api/updatePlayer'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import TableHeader from '../components/tables/TableHeader'
import Loading from '../components/Loading'
import findPlayer from '../api/findPlayer'
import routes from '../constants/routes'
import { useRecoilValue } from 'recoil'
import activeGameState from '../state/activeGameState'

const PlayerProps = () => {
  const location = useLocation()

  const [originalPlayer, setOriginalPlayer] = useState(location.state?.player)
  const [player, setPlayer] = useState(location.state?.player)

  const [newProps, setNewProps] = useState([])
  const [error, setError] = useState(null)
  const [isUpdating, setUpdating] = useState(false)
  const [isLoading, setLoading] = useState(!location.state?.player)

  const activeGame = useRecoilValue(activeGameState)

  const history = useHistory()
  const { id: playerId } = useParams()

  useEffect(() => {
    (async () => {
      if (isLoading) {
        try {
          const res = await findPlayer(activeGame.id, playerId)
          const player = res.data.players.find((p) => p.id === playerId)

          if (player) {
            setOriginalPlayer(player)
            setPlayer(player)
            setLoading(false)
          } else {
            history.replace(routes.players)
          }
        } catch (err) {
          history.replace(routes.players)
        }
      }
    })()
  }, [isLoading])

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

    const props = [
      ...player.props,
      ...newProps
    ]

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

  if (isLoading) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  const existingProps = player.props
    .filter((prop) => prop.value !== null)
    .sort((a, b) => a.key.localeCompare(b.key))

  return (
    <div className='space-y-4 md:space-y-8'>
      <Title showBackButton>Player properties</Title>

      <div>
        Showing properties for <code className='bg-gray-900 rounded p-2 ml-1 text-sm'>{player.id}</code>
      </div>

      <div className='w-full lg:w-1/2'>
        {existingProps.length + newProps.length === 0 &&
          <p>This player has no custom properties. Click the button below to add one.</p>
        }

        {existingProps.length + newProps.length > 0 &&
          <div className='overflow-x-scroll'>
            <table className='table-auto w-full'>
              <TableHeader columns={['Property', 'Value', '']} />
              <TableBody iterator={existingProps}>
                {(prop) => (
                  <>
                    <TableCell>{prop.key}</TableCell>
                    <TableCell className='min-w-80'>
                      <TextInput
                        id={`edit-${prop.key}`}
                        variant='light'
                        placeholder='Value'
                        onChange={(value) => editExistingProp(prop.key, value)}
                        value={prop.value}
                      />
                    </TableCell>
                    <TableCell className='min-w-30'>
                      <Button
                        variant='icon'
                        className='p-1 rounded-full bg-indigo-900 ml-auto'
                        onClick={() => deleteExistingProp(prop.key)}
                        icon={<IconTrash size={16} />}
                      />
                    </TableCell>
                  </>
                )}
              </TableBody>
              <TableBody iterator={newProps} startIdx={existingProps.length}>
                {(prop, idx) => (
                  <>
                    <TableCell>
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
                    <TableCell className='min-w-30'>
                      <Button
                        variant='icon'
                        className='p-1 rounded-full bg-indigo-900 ml-auto'
                        onClick={() => deleteNewProp(idx)}
                        icon={<IconTrash size={16} />}
                      />
                    </TableCell>
                  </>
                )}
              </TableBody>
            </table>
          </div>
        }

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
