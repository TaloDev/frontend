import { MouseEvent, useState } from 'react'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import { PlayerGameStat } from '../entities/playerGameStat'
import { KeyedMutator } from 'swr'
import updateStatValue from '../api/updateStatValue'
import activeGameState from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import { SelectedActiveGame } from '../state/activeGameState'
import { upperFirst } from 'lodash-es'

type UpdateStatValueProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<{ stats: PlayerGameStat[] }>
  editingStat: PlayerGameStat
}

export default function UpdateStatValue({ modalState, mutate, editingStat }: UpdateStatValueProps) {
  const [, setOpen] = modalState
  const [value, setValue] = useState(editingStat.value.toString())
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const onCreateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { playerStat } = await updateStatValue(activeGame.id, editingStat.stat.id, editingStat.id, Number(value))
      mutate((data) => {
        return {
          ...data,
          stats: [...data!.stats.filter((stat) => stat.id !== editingStat!.id), playerStat]
        }
      }, true)
      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <Modal
      id='update-player-stat'
      title={upperFirst(editingStat.stat.name)}
      modalState={modalState}
    >
      <form>
        <div className='p-4 space-y-4'>
          <div>
            <p className='font-semibold'>Current value</p>
            <p>{editingStat.value}</p>
          </div>

          <TextInput
            id='value'
            variant='light'
            type='number'
            label='New value'
            placeholder='Stat value'
            onChange={setValue}
            value={value}
            inputClassName='border border-gray-200 focus:border-opacity-0'
          />

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          <div className='w-full md:w-32'>
            <Button
              disabled={!value}
              isLoading={isLoading}
              onClick={onCreateClick}
            >
              Update
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
