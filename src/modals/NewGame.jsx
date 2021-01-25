import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import createGame from '../api/createGame'
import { useRecoilState } from 'recoil'
import gamesState from '../atoms/gamesState'
import activeGameState from '../atoms/activeGameState'

const NewGame = (props) => {
  const [, setOpen] = props.modalState
  const [name, setName] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [games, setGames] = useRecoilState(gamesState)
  const [, setActiveGame] = useRecoilState(activeGameState)

  const resetModal = () => {
    setOpen(false)
    setName('')
    setLoading(false)
  }

  const onCreateClick = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await createGame(name)
      setGames([...games, res.data.game])
      setActiveGame(res.data.game)
    } catch (err) {
      console.error(err.message)
    } finally {
      resetModal()
    }
  }

  return (
    <Modal
      id='new-game'
      title='Create new game'
      modalState={props.modalState}
    >
      <form>
        <div className='p-4'>
          <TextInput
            id='name'
            variant='light'
            label='Name'
            placeholder='Game name'
            onChange={setName}
            value={name}
            inputClassName='border border-gray-200 focus:border-opacity-0'
          />
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          <div className='w-full md:w-32'>
            <Button
              disabled={!name || isLoading}
              isLoading={isLoading}
              onClick={onCreateClick}
            >
              Create
            </Button>
          </div>
          <div className='w-full md:w-32'>
            <Button variant='grey' onClick={() => setOpen(false)}>Cancel</Button>
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
