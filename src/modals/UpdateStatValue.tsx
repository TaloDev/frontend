import { upperFirst } from 'lodash-es'
import { MouseEvent, useContext, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { KeyedMutator } from 'swr'
import updateStatValue from '../api/updateStatValue'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { PlayerGameStat } from '../entities/playerGameStat'
import activeGameState from '../state/activeGameState'
import { SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

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

  const toast = useContext(ToastContext)

  const onUpdateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { playerStat } = await updateStatValue(
        activeGame.id,
        editingStat.stat.id,
        editingStat.id,
        Number(value),
      )
      await mutate((data) => {
        return {
          ...data,
          stats: [...data!.stats.filter((stat) => stat.id !== editingStat!.id), playerStat],
        }
      }, true)

      toast.trigger(`${editingStat.stat.name} value updated`, ToastType.SUCCESS)

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
        <div className='space-y-4 p-4'>
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

        <div className='flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='w-full md:w-32'>
            <Button disabled={!value} isLoading={isLoading} onClick={onUpdateClick}>
              Update
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
