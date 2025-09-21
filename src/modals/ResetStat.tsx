import { useContext, useState } from 'react'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Select from '../components/Select'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import { GameStat } from '../entities/gameStat'
import clsx from 'clsx'
import { resetStat } from '../api/resetStat'
import ToastContext from '../components/toast/ToastContext'
import { ResetMode, resetModeOptions } from '../constants/resetMode'

type ResetStatProps = {
  modalState: [boolean, (goBack: boolean) => void]
  editingStat: GameStat | null
}

export function ResetStat({
  modalState,
  editingStat
}: ResetStatProps) {
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
      toast.trigger(`${res.deletedCount} ${res.deletedCount === 1 ? 'entry was' : 'entries were'} deleted`)
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
        'md:!h-[55vh]': isMenuOpen
      })}
    >
      <form className='flex flex-col grow'>
        <div className='p-4 space-y-4'>
          <p>
            After clicking <b>Reset</b>, all player stat data matching the selected reset mode will be permanently deleted. This action cannot be undone.
          </p>
          <div className='p-4 text-sm bg-yellow-50 border border-yellow-300 rounded'>
            <p>If Steamworks syncing is enabled, your Talo stat data is deleted instantly, but the associated Steamworks player stats may take up to an hour to update.</p>
          </div>

          <div className='w-full'>
            <label htmlFor='reset-mode' className='block font-semibold mb-1'>Reset mode</label>
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

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200 mt-auto'>
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
            <Button type='button' variant='grey' onClick={() => goBack(false)}>Back</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
