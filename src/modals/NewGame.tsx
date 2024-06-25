import { MouseEvent, useState } from 'react'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import createGame from '../api/createGame'
import { useRecoilState, useSetRecoilState } from 'recoil'
import userState, { AuthedUserState } from '../state/userState'
import buildError from '../utils/buildError'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import activeGameState from '../state/activeGameState'

type NewGameProps = {
  modalState: [boolean, (open: boolean) => void]
}

export default function NewGame({ modalState }: NewGameProps) {
  const [, setOpen] = modalState
  const [name, setName] = useState('')
  const [isLoading, setLoading] = useState(false)

  const [user, setUser] = useRecoilState(userState) as AuthedUserState

  const setActiveGame = useSetRecoilState(activeGameState)
  const [error, setError] = useState<TaloError | null>(null)

  const onCreateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { game } = await createGame(name)
      setUser({
        ...user,
        organisation: {
          ...user.organisation,
          games: [...user.organisation.games, game]
        }
      })
      setActiveGame(game)
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
      modalState={modalState}
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
