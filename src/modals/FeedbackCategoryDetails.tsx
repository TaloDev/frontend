import { MouseEvent, useState } from 'react'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import RadioGroup from '../components/RadioGroup'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState, { AuthedUser } from '../state/userState'
import { useRecoilValue } from 'recoil'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'
import deleteFeedbackCategory from '../api/deleteFeedbackCategory'
import updateFeedbackCategory from '../api/updateFeedbackCategory'
import createFeedbackCategory from '../api/createFeedbackCategory'
import { GameFeedbackCategory } from '../entities/gameFeedbackCategory'
import { KeyedMutator } from 'swr'

type FeedbackCategoryDetailsProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<{ feedbackCategories: GameFeedbackCategory[] }>
  editingCategory: GameFeedbackCategory | null
}

export default function FeedbackCategoryDetails({
  modalState,
  mutate,
  editingCategory
}: FeedbackCategoryDetailsProps) {
  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const user = useRecoilValue(userState) as AuthedUser

  const [internalName, setInternalName] = useState(editingCategory?.internalName ?? '')
  const [displayName, setDisplayName] = useState(editingCategory?.name ?? '')
  const [description, setDescription] = useState(editingCategory?.description ?? '')
  const [anonymised, setAnonymised] = useState(editingCategory?.anonymised ?? false)

  const onCreateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { feedbackCategory } = await createFeedbackCategory(activeGame.id, { internalName, name: displayName, description, anonymised })

      mutate((data) => {
        return {
          ...data,
          feedbackCategories: [
            ...data!.feedbackCategories,
            feedbackCategory
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
      const { feedbackCategory } = await updateFeedbackCategory(activeGame.id, editingCategory!.id, { internalName, name: displayName, description, anonymised })

      mutate((data) => {
        return {
          ...data,
          feedbackCategories: data!.feedbackCategories.map((existingCategory) => {
            if (existingCategory.id === feedbackCategory.id) return feedbackCategory
            return existingCategory
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
    if (!window.confirm('Are you sure you want to delete this feedback category? This will permanently delete all feedback in this category.')) return

    setDeleting(true)
    setError(null)

    try {
      await deleteFeedbackCategory(activeGame.id, editingCategory!.id)

      mutate((data) => {
        return {
          ...data,
          feedbackCategories: data!.feedbackCategories.filter((existingCategory) => {
            return existingCategory.id !== editingCategory!.id
          })
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setDeleting(false)
    }
  }

  return (
    <Modal
      id='feedback-category-details'
      title={editingCategory ? 'Update feedback category' : 'Create feedback category'}
      modalState={modalState}
    >
      <form>
        <div className='p-4 space-y-4'>
          <TextInput
            startFocused
            id='internal-name'
            variant='modal'
            label='Internal name'
            placeholder='The unique identifier for this category'
            onChange={setInternalName}
            value={internalName}
            disabled={!!editingCategory}
          />

          <TextInput
            id='display-name'
            variant='modal'
            label='Display name'
            placeholder='The public-facing name of this category'
            onChange={setDisplayName}
            value={displayName}
          />

          <TextInput
            id='description'
            variant='modal'
            label='Description'
            placeholder='Feedback category description'
            onChange={setDescription}
            value={description}
          />

          <RadioGroup
            label='Anonymised feedback?'
            name='anonymised'
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ]}
            onChange={(value) => setAnonymised(value)}
            value={anonymised}
          />

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          {!editingCategory &&
            <div className='w-full md:w-32'>
              <Button
                disabled={!internalName || !displayName || !description}
                isLoading={isLoading}
                onClick={onCreateClick}
              >
                Create
              </Button>
            </div>
          }
          {editingCategory &&
            <div className='flex space-x-2'>
              {canPerformAction(user, PermissionBasedAction.DELETE_FEEDBACK_CATEGORY) &&
                <div className='w-full md:w-32'>
                  <Button
                    type='button'
                    isLoading={isDeleting}
                    onClick={onDeleteClick}
                    variant='red'
                  >
                    Delete
                  </Button>
                </div>
              }

              <div className='w-full md:w-32'>
                <Button
                  disabled={!internalName || !displayName || !description || isDeleting}
                  isLoading={isLoading}
                  onClick={onUpdateClick}
                >
                  Update
                </Button>
              </div>
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
