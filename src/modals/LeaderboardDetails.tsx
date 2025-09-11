import { MouseEvent, useState } from 'react'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import createLeaderboard from '../api/createLeaderboard'
import buildError from '../utils/buildError'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Select from '../components/Select'
import RadioGroup from '../components/RadioGroup'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState, { AuthedUser } from '../state/userState'
import { useRecoilValue } from 'recoil'
import updateLeaderboard from '../api/updateLeaderboard'
import deleteLeaderboard from '../api/deleteLeaderboard'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'
import { Leaderboard, LeaderboardSortMode, LeaderboardRefreshInterval } from '../entities/leaderboard'
import { KeyedMutator } from 'swr'
import clsx from 'clsx'
import { IconRefresh, IconTrash } from '@tabler/icons-react'

type LeaderboardDetailsProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<{ leaderboards: Leaderboard[] }>
  editingLeaderboard: Leaderboard | null
  onResetClick: () => void
}

const LeaderboardDetails = ({
  modalState,
  mutate,
  editingLeaderboard,
  onResetClick
}: LeaderboardDetailsProps) => {
  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const user = useRecoilValue(userState) as AuthedUser

  const [internalName, setInternalName] = useState(editingLeaderboard?.internalName ?? '')
  const [displayName, setDisplayName] = useState(editingLeaderboard?.name ?? '')
  const [sortMode, setSortMode] = useState(editingLeaderboard?.sortMode ?? LeaderboardSortMode.DESC)
  const [refreshInterval, setRefreshInterval] = useState(editingLeaderboard?.refreshInterval ?? LeaderboardRefreshInterval.NEVER)

  const [unique, setUnique] = useState(editingLeaderboard?.unique ?? false)

  const [isMenuOpen, setMenuOpen] = useState(false)

  const onCreateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { leaderboard } = await createLeaderboard(activeGame.id, { internalName, name: displayName, sortMode, unique, refreshInterval })

      mutate((data) => {
        return {
          ...data,
          leaderboards: [
            ...data!.leaderboards,
            leaderboard
          ]
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err, 'internalName'))
      setLoading(false)
    }
  }

  const onUpdateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { leaderboard } = await updateLeaderboard(activeGame.id, editingLeaderboard!.id, { internalName, name: displayName, sortMode, unique, refreshInterval })

      mutate((data) => {
        return {
          ...data,
          leaderboards: data!.leaderboards.map((existingLeaderboard) => {
            if (existingLeaderboard.id === leaderboard.id) return leaderboard
            return existingLeaderboard
          })
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err, 'internalName'))
      setLoading(false)
    }
  }

  const onDeleteClick = async () => {
    /* v8ignore next */
    if (!window.confirm('Are you sure you want to delete this leaderboard?')) return

    setDeleting(true)
    setError(null)

    try {
      await deleteLeaderboard(activeGame.id, editingLeaderboard!.id)

      mutate((data) => {
        return {
          ...data,
          leaderboards: data!.leaderboards.filter((existingLeaderboard) => {
            return existingLeaderboard.id !== editingLeaderboard!.id
          })
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setDeleting(false)
    }
  }

  const sortModeOptions = [
    { label: 'Descending', value: LeaderboardSortMode.DESC },
    { label: 'Ascending', value: LeaderboardSortMode.ASC }
  ]

  const refreshIntervalOptions = [
    { label: 'Never', value: LeaderboardRefreshInterval.NEVER },
    { label: 'Daily', value: LeaderboardRefreshInterval.DAILY },
    { label: 'Weekly', value: LeaderboardRefreshInterval.WEEKLY },
    { label: 'Monthly', value: LeaderboardRefreshInterval.MONTHLY },
    { label: 'Yearly', value: LeaderboardRefreshInterval.YEARLY }
  ]

  return (
    <Modal
      id='leaderboard-details'
      title={editingLeaderboard ? 'Update leaderboard' : 'Create leaderboard'}
      modalState={modalState}
      className={clsx('flex flex-col', {
        'md:!h-[75vh]': isMenuOpen
      })}
    >
      <form className='flex flex-col grow'>
        <div className='p-4 space-y-4'>
          <TextInput
            startFocused
            id='internal-name'
            variant='modal'
            label='Internal name'
            placeholder='The unique identifier for this leaderboard'
            onChange={setInternalName}
            value={internalName}
            disabled={!!editingLeaderboard}
          />

          <TextInput
            id='display-name'
            variant='modal'
            label='Display name'
            placeholder='The public-facing name of this leaderboard'
            onChange={setDisplayName}
            value={displayName}
          />

          <div className='w-full'>
            <label htmlFor='sort-mode' className='block font-semibold mb-1'>Sort mode</label>
            <Select
              inputId='sort-mode'
              defaultValue={sortModeOptions.find((option) => option.value === sortMode)}
              onChange={(option) => setSortMode(option!.value)}
              options={sortModeOptions}
            />
          </div>

          <div className='w-full'>
            <label htmlFor='refresh-interval' className='block font-semibold mb-1'>Refresh entries</label>
            <p className='text-sm text-gray-500 mb-2'>Hide leaderboard entries older than the selected interval</p>
            <Select
              inputId='refresh-interval'
              defaultValue={refreshIntervalOptions.find((option) => option.value === refreshInterval)}
              onChange={(option) => setRefreshInterval(option!.value)}
              options={refreshIntervalOptions}
              onMenuOpen={() => setMenuOpen(true)}
              onMenuClose={() => setMenuOpen(false)}
            />
          </div>

          <RadioGroup
            label='Unique entries only?'
            name='unique'
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ]}
            onChange={(value) => setUnique(value)}
            value={unique}
          />

          {editingLeaderboard && canPerformAction(user, PermissionBasedAction.DELETE_LEADERBOARD) &&
            <div className='p-4 space-y-2 bg-red-100 border border-red-400 rounded'>
              <p className='font-semibold'>Danger zone</p>

              <p className='space-y-2'>
                <p>Once taken, these actions are irreversible.</p>
                <div className='flex space-x-2'>
                  <Button
                    type='button'
                    isLoading={isDeleting}
                    onClick={onResetClick}
                    variant='red'
                    className='!w-auto'
                    icon={<IconRefresh />}
                  >
                    <span>
                      Reset
                    </span>
                  </Button>

                  <Button
                    type='button'
                    isLoading={isDeleting}
                    onClick={onDeleteClick}
                    variant='red'
                    className='!w-auto'
                    icon={<IconTrash />}
                  >
                    <span>
                      Delete
                    </span>
                  </Button>
                </div>
              </p>
            </div>
          }

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200 mt-auto'>
          {!editingLeaderboard &&
            <div className='w-full md:w-32'>
              <Button
                disabled={!internalName || !displayName || !sortMode}
                isLoading={isLoading}
                onClick={onCreateClick}
              >
                Create
              </Button>
            </div>
          }
          {editingLeaderboard &&
            <div className='w-full md:w-32'>
              <Button
                disabled={!internalName || !displayName || !sortMode || isDeleting}
                isLoading={isLoading}
                onClick={onUpdateClick}
              >
                Update
              </Button>
            </div>
          }
          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default LeaderboardDetails
