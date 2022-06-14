import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import createGame from '../api/createGame'
import { useRecoilState, useSetRecoilState } from 'recoil'
import activeGameState from '../state/activeGameState'
import userState from '../state/userState'
import buildError from '../utils/buildError'
import ErrorMessage from '../components/ErrorMessage'

const NewGame = (props) => {
  const [, setOpen] = props.modalState
  const [name, setName] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [user, setUser] = useRecoilState(userState)
  const setActiveGame = useSetRecoilState(activeGameState)
  const [error, setError] = useState(null)

  const onCreateClick = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await createGame(name)
      setUser({
        ...user,
        organisation: {
          ...user.organisation,
          games: [...user.organisation.games, res.data.game]
        }
      })
      setActiveGame(res.data.game)
      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <Modal
      id='new-game'
      title='Create new game'
      modalState={props.modalState}
    >
      <form>
        <div className='p-4 space-y-4'>
          <TextInput
            id='name'
            variant='light'
            label='Name'
            placeholder='Game name'
            onChange={setName}
            value={name}
            inputClassName='border border-gray-200 focus:border-opacity-0'
          />

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          <div className='w-full md:w-32'>
            <Button
              disabled={!name}
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

NewGame.propTypes = {
  modalState: PropTypes.array.isRequired
}

export default NewGame
