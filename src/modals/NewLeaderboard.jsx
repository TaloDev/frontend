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
import { useRecoilValue } from 'recoil'

const NewLeaderboard = ({ modalState, mutate }) => {
  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const activeGame = useRecoilValue(activeGameState)

  const [internalName, setInternalName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [sortMode, setSortMode] = useState('desc')
  const [unique, setUnique] = useState(false)

  const onCreateClick = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await createLeaderboard({ gameId: activeGame.id, internalName, name: displayName, sortMode, unique })

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

  return (
    <Modal
      id='new-leaderboard'
      title='Create new leaderboard'
      modalState={modalState}
    >
      <form>
        <div className='p-4 space-y-4'>
          <TextInput
            id='internal-name'
            variant='modal'
            label='Internal name'
            placeholder='The unique identifier for this leaderboard'
            onChange={setInternalName}
            value={internalName}
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
              defaultValue={{ label: 'Descending', value: 'desc' }}
              onChange={(option) => setSortMode(option.value)}
              options={[
                { label: 'Descending', value: 'desc' },
                { label: 'Ascending', value: 'asc' }
              ]}
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

          <ErrorMessage error={error} />
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          <div className='w-full md:w-32'>
            <Button
              disabled={!internalName || !displayName || !sortMode}
              isLoading={isLoading}
              onClick={onCreateClick}
            >
              Create
            </Button>
          </div>
          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

NewLeaderboard.propTypes = {
  modalState: PropTypes.array.isRequired,
  mutate: PropTypes.func.isRequired
}

export default NewLeaderboard
