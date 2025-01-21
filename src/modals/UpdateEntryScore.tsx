import { MouseEvent, useState } from 'react'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import { LeaderboardEntry } from '../entities/leaderboardEntry'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import updateLeaderboardEntry from '../api/updateLeaderboardEntry'
import { Leaderboard } from '../entities/leaderboard'
import { upperFirst } from 'lodash-es'
import { KeyedMutator } from 'swr'

type UpdateEntryScoreProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<{ entries: LeaderboardEntry[] }>
  editingEntry: LeaderboardEntry
  leaderboard: Leaderboard
}

export default function UpdateEntryScore({ modalState, mutate, editingEntry, leaderboard }: UpdateEntryScoreProps) {
  const [, setOpen] = modalState
  const [score, setScore] = useState(editingEntry.score.toString())
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const onUpdateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { entry } = await updateLeaderboardEntry(activeGame.id, leaderboard.id, editingEntry.id, { newScore: Number(score) })
      mutate((data) => {
        return {
          ...data,
          entries: [...data!.entries.filter((e) => e.id !== editingEntry.id), entry]
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
      id='update-entry-score'
      title={upperFirst(editingEntry.leaderboardName)}
      modalState={modalState}
    >
      <form>
        <div className='p-4 space-y-4'>
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

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          <div className='w-full md:w-32'>
            <Button
              disabled={!score}
              isLoading={isLoading}
              onClick={onUpdateClick}
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
