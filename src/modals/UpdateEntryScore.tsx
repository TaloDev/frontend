import { upperFirst } from 'lodash-es'
import { MouseEvent, useContext, useState } from 'react'
import { useRecoilValue } from 'recoil'
import updateLeaderboardEntry from '../api/updateLeaderboardEntry'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { Leaderboard } from '../entities/leaderboard'
import { LeaderboardEntry } from '../entities/leaderboardEntry'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

type UpdateEntryScoreProps = {
  modalState: [boolean, (open: boolean) => void]
  onEntryUpdated: (entry: LeaderboardEntry) => void
  editingEntry: LeaderboardEntry
  leaderboard: Leaderboard
}

export default function UpdateEntryScore({
  modalState,
  onEntryUpdated,
  editingEntry,
  leaderboard,
}: UpdateEntryScoreProps) {
  const [, setOpen] = modalState
  const [score, setScore] = useState(editingEntry.score.toString())
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const toast = useContext(ToastContext)

  const onUpdateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { entry } = await updateLeaderboardEntry(
        activeGame.id,
        leaderboard.id,
        editingEntry.id,
        { newScore: Number(score) },
      )
      onEntryUpdated(entry)

      toast.trigger(`${leaderboard.name} score updated`, ToastType.SUCCESS)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <Modal
      id='update-entry-score'
      title={upperFirst(editingEntry.leaderboardName)}
      modalState={modalState}
    >
      <form>
        <div className='space-y-4 p-4'>
          <div>
            <p className='font-semibold'>Current score</p>
            <p>{editingEntry.score}</p>
          </div>

          <TextInput
            id='score'
            variant='light'
            type='number'
            label='New score'
            placeholder='Enter new score'
            onChange={setScore}
            value={score}
            inputClassName='border border-gray-200 focus:border-opacity-0'
          />

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='w-full md:w-32'>
            <Button disabled={!score} isLoading={isLoading} onClick={onUpdateClick}>
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
