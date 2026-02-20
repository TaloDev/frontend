import { MouseEvent, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import createGame from '../api/createGame'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import activeGameState from '../state/activeGameState'
import userState, { AuthedUserState } from '../state/userState'
import buildError from '../utils/buildError'

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
      const allGames = [...user.organisation.games, game]

      setUser({
        ...user,
        organisation: {
          ...user.organisation,
          games: allGames,
        },
      })
      setActiveGame(game)
      setOpen(false)

      if (allGames.length > 1) {
        window.location.href = '/'
      }
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <Modal id='new-game' title='Create new game' modalState={modalState}>
      <form>
        <div className='space-y-4 p-4'>
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

        <div className='flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='w-full md:w-32'>
            <Button disabled={!name} isLoading={isLoading} onClick={onCreateClick}>
              Create
            </Button>
          </div>
          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
