import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import createLeaderboard from '../api/createLeaderboard'
import buildError from '../utils/buildError'
import ErrorMessage from '../components/ErrorMessage'
import Select from '../components/Select'
import RadioGroup from '../components/RadioGroup'
import activeGameState from '../state/activeGameState'
import userState from '../state/userState'
import { useRecoilValue } from 'recoil'
import updateLeaderboard from '../api/updateLeaderboard'
import deleteLeaderboard from '../api/deleteLeaderboard'
import canPerformAction, { permissionBasedActions } from '../utils/canPerformAction'

const LeaderboardDetails = ({ modalState, mutate, editingLeaderboard }) => {
  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const activeGame = useRecoilValue(activeGameState)

  const [internalName, setInternalName] = useState(editingLeaderboard?.internalName ?? '')
  const [displayName, setDisplayName] = useState(editingLeaderboard?.name ?? '')
  const [sortMode, setSortMode] = useState(editingLeaderboard?.sortMode ?? 'desc')
  const [unique, setUnique] = useState(editingLeaderboard?.unique ?? false)

  const user = useRecoilValue(userState)

  const onCreateClick = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await createLeaderboard(activeGame.id, { internalName, name: displayName, sortMode, unique })

      mutate((data) => {
        return {
          ...data,
          leaderboards: [
            ...data.leaderboards,
            res.data.leaderboard
          ]
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  const onUpdateClick = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await updateLeaderboard(activeGame.id, editingLeaderboard.id, { internalName, name: displayName, sortMode, unique })

      mutate((data) => {
        return {
          ...data,
          leaderboards: data.leaderboards.map((existingLeaderboard) => {
            if (existingLeaderboard.id === res.data.leaderboard.id) return res.data.leaderboard
            return existingLeaderboard
          })
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  const onDeleteClick = async () => {
    /* istanbul ignore if */
    if (!window.confirm('Are you sure you want to delete this leaderboard?')) return

    setDeleting(true)
    setError(null)

    try {
      await deleteLeaderboard(activeGame.id, editingLeaderboard.id)

      mutate((data) => {
        return {
          ...data,
          leaderboards: data.leaderboards.filter((existingLeaderboard) => {
            return existingLeaderboard.id !== editingLeaderboard.id
          })
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setDeleting(false)
    }
  }

  const sortModeOptions = [
    { label: 'Descending', value: 'desc' },
    { label: 'Ascending', value: 'asc' }
  ]

  return (
    <Modal
      id='leaderboard-details'
      title={editingLeaderboard ? 'Update leaderboard' : 'Create new leaderboard'}
      modalState={modalState}
    >
      <form>
        <div className='p-4 space-y-4'>
          <TextInput
            startFocused
            id='internal-name'
            variant='modal'
            label='Internal name'
            placeholder='The unique identifier for this leaderboard'
            onChange={setInternalName}
            value={internalName}
            disabled={!!editingLeaderboard}
          />

          <TextInput
            id='display-name'
            variant='modal'
            label='Display name'
            placeholder='The public-facing name of this leaderboard'
            onChange={setDisplayName}
            value={displayName}
          />

          <div className='w-full'>
            <label htmlFor='sort-mode' className='block font-semibold mb-1'>Sort mode</label>
            <Select
              inputId='sort-mode'
              defaultValue={sortModeOptions.find((option) => option.value === sortMode)}
              onChange={(option) => setSortMode(option.value)}
              options={sortModeOptions}
            />
          </div>

          <RadioGroup
            label='Unique entries only?'
            name='unique'
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ]}
            onChange={(value) => setUnique(value)}
            value={unique}
          />

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          {!editingLeaderboard &&
            <div className='w-full md:w-32'>
              <Button
                disabled={!internalName || !displayName || !sortMode}
                isLoading={isLoading}
                onClick={onCreateClick}
              >
                Create
              </Button>
            </div>
          }
          {editingLeaderboard &&
            <div className='flex space-x-2'>
              {canPerformAction(user, permissionBasedActions.DELETE_LEADERBOARD) &&
                <div className='w-full md:w-32'>
                  <Button
                    type='button'
                    isLoading={isDeleting}
                    onClick={onDeleteClick}
                    variant='red'
                  >
                    Delete
                  </Button>
                </div>
              }

              <div className='w-full md:w-32'>
                <Button
                  disabled={!internalName || !displayName || !sortMode || isDeleting}
                  isLoading={isLoading}
                  onClick={onUpdateClick}
                >
                  Update
                </Button>
              </div>
            </div>
          }
          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

LeaderboardDetails.propTypes = {
  modalState: PropTypes.array.isRequired,
  mutate: PropTypes.func.isRequired,
  editingLeaderboard: PropTypes.object
}

export default LeaderboardDetails
