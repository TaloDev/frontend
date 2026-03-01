import clsx from 'clsx'
import { useContext, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { resetFeedbackCategory } from '../api/resetFeedbackCategory'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import Select from '../components/Select'
import TextInput from '../components/TextInput'
import ToastContext from '../components/toast/ToastContext'
import { ResetMode, resetModeOptions } from '../constants/resetMode'
import { GameFeedbackCategory } from '../entities/gameFeedbackCategory'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

type ResetFeedbackCategoryProps = {
  modalState: [boolean, (goBack: boolean) => void]
  editingCategory: GameFeedbackCategory | null
}

export function ResetFeedbackCategory({ modalState, editingCategory }: ResetFeedbackCategoryProps) {
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
      const res = await resetFeedbackCategory(activeGame.id, editingCategory!.id, resetMode)
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
      id='reset-feedback-category'
      title={`Reset ${editingCategory?.name}`}
      modalState={[true, () => goBack(true)]}
      className={clsx('flex flex-col', {
        'md:h-[55vh]!': isMenuOpen,
      })}
    >
      <form className='flex grow flex-col'>
        <div className='space-y-4 p-4'>
          <p>
            After clicking <b>Reset</b>, all feedback in this category matching the selected reset
            mode will be permanently deleted. This action cannot be undone.
          </p>

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
