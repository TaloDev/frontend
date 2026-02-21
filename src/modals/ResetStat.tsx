import clsx from 'clsx'
import { useContext, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { resetStat } from '../api/resetStat'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import Select from '../components/Select'
import TextInput from '../components/TextInput'
import ToastContext from '../components/toast/ToastContext'
import { ResetMode, resetModeOptions } from '../constants/resetMode'
import { GameStat } from '../entities/gameStat'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

type ResetStatProps = {
  modalState: [boolean, (goBack: boolean) => void]
  editingStat: GameStat | null
}

export function ResetStat({ modalState, editingStat }: ResetStatProps) {
  const [, goBack] = modalState
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const [confirmText, setConfirmText] = useState('')
  const [resetMode, setResetMode] = useState<ResetMode>('dev')

  const [isMenuOpen, setMenuOpen] = useState(false)

  const toast = useContext(ToastContext)

  const onResetClick = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await resetStat(activeGame.id, editingStat!.id, resetMode)
      toast.trigger(
        `${res.deletedCount} ${res.deletedCount === 1 ? 'entry was' : 'entries were'} deleted`,
      )
      goBack(true)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <Modal
      id='reset-stat'
      title={`Reset ${editingStat?.name}`}
      modalState={[true, () => goBack(true)]}
      className={clsx('flex flex-col', {
        'md:!h-[55vh]': isMenuOpen,
      })}
    >
      <form className='flex grow flex-col'>
        <div className='space-y-4 p-4'>
          <p>
            After clicking <b>Reset</b>, all player stat data matching the selected reset mode will
            be permanently deleted. This action cannot be undone.
          </p>
          <div className='rounded border border-yellow-300 bg-yellow-50 p-4 text-sm'>
            <p>
              If Steamworks syncing is enabled, your Talo stat data is deleted instantly, but the
              associated Steamworks player stats may take up to an hour to update.
            </p>
          </div>

          <div className='w-full'>
            <label htmlFor='reset-mode' className='mb-1 block font-semibold'>
              Reset mode
            </label>
            <Select
              inputId='reset-mode'
              onChange={(option) => setResetMode(option!.value)}
              defaultValue={resetModeOptions.find((option) => option.value === 'dev')}
              options={resetModeOptions}
              onMenuOpen={() => setMenuOpen(true)}
              onMenuClose={() => setMenuOpen(false)}
            />
          </div>

          <TextInput
            id='confirm'
            variant='modal'
            label='Type "confirm" below'
            placeholder='confirm'
            onChange={setConfirmText}
            value={confirmText}
          />

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='mt-auto flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='w-full md:w-32'>
            <Button
              type='button'
              isLoading={isLoading}
              disabled={confirmText !== 'confirm'}
              onClick={onResetClick}
              variant='red'
            >
              Reset
            </Button>
          </div>
          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => goBack(false)}>
              Back
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
