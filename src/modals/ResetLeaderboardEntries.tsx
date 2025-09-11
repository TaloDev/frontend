import { useContext, useState } from 'react'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Select from '../components/Select'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import { Leaderboard } from '../entities/leaderboard'
import clsx from 'clsx'
import { resetLeaderboard } from '../api/resetLeaderboard'
import ToastContext from '../components/toast/ToastContext'
import { ResetMode, resetModeOptions } from '../constants/resetMode'

type ResetLeaderboardEntriesProps = {
  modalState: [boolean, (goBack: boolean) => void]
  editingLeaderboard: Leaderboard | null
}

export function ResetLeaderboardEntries({
  modalState,
  editingLeaderboard
}: ResetLeaderboardEntriesProps) {
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
      const res = await resetLeaderboard(activeGame.id, editingLeaderboard!.id, resetMode)
      toast.trigger(`${res.deletedCount} ${res.deletedCount === 1 ? 'entry' : 'entries'} were deleted`)
      goBack(true)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <Modal
      id='reset-leaderboard-entries'
      title='Reset leaderboard entries'
      modalState={modalState}
      className={clsx('flex flex-col', {
        'md:!h-[55vh]': isMenuOpen
      })}
    >
      <form className='flex flex-col grow'>
        <div className='p-4 space-y-4'>
          <p>
            After clicking <b>Reset</b>, all leaderboard entries from players matching the selected reset mode will be permanently deleted. This action cannot be undone.
          </p>

          <div className='w-full'>
            <label htmlFor='refresh-interval' className='block font-semibold mb-1'>Reset mode</label>
            <Select
              inputId='refresh-interval'
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
