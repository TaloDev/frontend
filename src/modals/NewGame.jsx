import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'

const NewGame = (props) => {
  const [, setOpen] = props.modalState
  const [name, setName] = useState('')

  return (
    <Modal
      id='new-game'
      title='Create new game'
      modalState={props.modalState}
    >
      <div className='p-4'>
        <TextInput
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
          <Button onClick={() => setOpen(false)}>Create</Button>
        </div>
        <div className='w-full md:w-32'>
          <Button variant='grey' onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </div>
    </Modal>
  )
}

NewGame.propTypes = {
  modalState: PropTypes.array.isRequired
}

export default NewGame
