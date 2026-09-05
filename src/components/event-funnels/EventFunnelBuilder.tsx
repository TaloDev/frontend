import { useAtomValue } from 'jotai'
import { SetStateAction, useContext, useState } from 'react'
import { createEventFunnel } from '../../api/createEventFunnel'
import { deleteEventFunnel } from '../../api/deleteEventFunnel'
import { updateEventFunnel } from '../../api/updateEventFunnel'
import { EventFunnel, EventFunnelRuleMode, EventFunnelStep } from '../../entities/eventFunnel'
import { SelectedActiveGame } from '../../state/activeGameState'
import { userState, AuthedUser } from '../../state/userState'
import buildError from '../../utils/buildError'
import canPerformAction, { PermissionBasedAction } from '../../utils/canPerformAction'
import { isFunnelStepsValid, prepareFunnelStep } from '../../utils/funnel-rules'
import Button from '../Button'
import ErrorMessage, { TaloError } from '../ErrorMessage'
import TextInput from '../TextInput'
import ToastContext, { ToastType } from '../toast/ToastContext'
import { EventFunnelPreview } from './EventFunnelPreview'
import { EventFunnelSteps } from './EventFunnelSteps'

type EventFunnelBuilderProps = {
  activeGame: SelectedActiveGame
  editingFunnel: EventFunnel | null
  onSaved: (funnel: EventFunnel) => Promise<void> | void
  onDeleted?: () => Promise<void> | void
  showPreview?: boolean
  previewLastUpdatedAt?: number
  previewOnRefresh?: () => Promise<void>
  previewRefreshing?: boolean
}

export function EventFunnelBuilder({
  activeGame,
  editingFunnel,
  onSaved,
  onDeleted,
  showPreview = true,
  previewLastUpdatedAt,
  previewOnRefresh,
  previewRefreshing,
}: EventFunnelBuilderProps) {
  const user = useAtomValue(userState) as AuthedUser

  const [interacted, setInteracted] = useState(false)
  const [name, setName] = useState(editingFunnel?.name ?? '')
  const [steps, setSteps] = useState<EventFunnelStep[]>(
    editingFunnel?.steps ?? [
      { name: '', props: { ruleMode: EventFunnelRuleMode.AND, rules: [] } },
      { name: '', props: { ruleMode: EventFunnelRuleMode.AND, rules: [] } },
    ],
  )
  const [maxGap, setMaxGap] = useState(editingFunnel?.maxGap?.toString() ?? '60')

  const onNameChange = (value: string) => {
    setName(value)
    setInteracted(true)
  }

  const setStepsInteracted = (update: SetStateAction<EventFunnelStep[]>) => {
    setInteracted(true)
    setSteps(update)
  }

  const [isLoading, setLoading] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [apiError, setAPIError] = useState<TaloError | null>(null)

  const toast = useContext(ToastContext)

  const nameValid = name.length > 0
  const maxGapNum = Number(maxGap)
  const maxGapValid = maxGap !== '' && Number.isFinite(maxGapNum) && maxGapNum > 0
  const allStepsValid = isFunnelStepsValid(steps)
  const canSave = nameValid && maxGapValid && allStepsValid
  const hasChanges =
    Boolean(editingFunnel) &&
    (name !== editingFunnel?.name ||
      maxGapNum !== editingFunnel?.maxGap ||
      JSON.stringify(steps) !== JSON.stringify(editingFunnel?.steps))
  const submitDisabled = editingFunnel
    ? !canSave || isDeleting || !hasChanges
    : !canSave || isDeleting

  const onResetClick = () => {
    setName(editingFunnel?.name ?? '')
    setSteps(editingFunnel?.steps ?? [])
    setMaxGap(editingFunnel?.maxGap?.toString() ?? '60')
  }

  const onSaveClick = async () => {
    setLoading(true)
    setAPIError(null)

    let savedFunnel: EventFunnel | null = null
    try {
      if (editingFunnel) {
        const { funnel } = await updateEventFunnel(activeGame.id, editingFunnel.id, {
          name,
          steps: steps.map(prepareFunnelStep),
          maxGap: maxGapNum,
        })
        savedFunnel = funnel
        toast.trigger(`${funnel.name} updated`, ToastType.SUCCESS)
      } else {
        const { funnel } = await createEventFunnel(activeGame.id, {
          name,
          steps: steps.map(prepareFunnelStep),
          maxGap: maxGapNum,
        })
        savedFunnel = funnel
        toast.trigger(`${funnel.name} created`, ToastType.SUCCESS)
      }
    } catch (err) {
      setAPIError(buildError(err))
      setLoading(false)
      return
    }

    // Revalidation runs after the mutation so a cache refresh failure isn't
    // reported as a failed save.
    await onSaved(savedFunnel)
    setLoading(false)
  }

  const onDeleteClick = async () => {
    if (!window.confirm('Are you sure you want to delete this funnel?')) {
      return
    }

    setDeleting(true)
    setAPIError(null)

    try {
      await deleteEventFunnel(activeGame.id, editingFunnel!.id)
      toast.trigger(`${editingFunnel!.name} deleted`)
    } catch (err) {
      setAPIError(buildError(err))
      setDeleting(false)
      return
    }

    setDeleting(false)
    await onDeleted?.()
  }

  const form = (
    <div className='space-y-4 rounded border border-gray-700 bg-gray-900 p-4'>
      <div className='w-full'>
        <TextInput
          id='name'
          label='Name'
          placeholder='Funnel name'
          onChange={onNameChange}
          value={name}
          errors={[interacted && !nameValid ? 'Name is required' : undefined]}
        />
      </div>

      <div className='w-full md:w-2/3'>
        <TextInput
          id='max-gap'
          type='number'
          containerClassName='w-32 md:w-40'
          label='Max gap'
          placeholder='Max gap'
          onChange={(value) => {
            setMaxGap(value)
            setInteracted(true)
          }}
          value={maxGap}
          errors={[interacted && !maxGapValid ? 'Must be a positive number' : undefined]}
        />
        <p className='mt-1 text-sm text-gray-400'>
          The maximum time in seconds a player can take to reach the next step.
        </p>
      </div>

      <EventFunnelSteps stepsState={[steps, setStepsInteracted]} showErrors={interacted} />

      {apiError && <ErrorMessage error={apiError} />}

      <div className='flex w-full items-center justify-between'>
        {editingFunnel && (
          <div>
            <Button type='button' variant='grey' disabled={!hasChanges} onClick={onResetClick}>
              Reset
            </Button>
          </div>
        )}

        <div className='ml-auto flex space-x-2'>
          {editingFunnel && canPerformAction(user, PermissionBasedAction.DELETE_GROUP) && (
            <div>
              <Button type='button' variant='red' isLoading={isDeleting} onClick={onDeleteClick}>
                Delete
              </Button>
            </div>
          )}

          <div>
            <Button
              type='button'
              disabled={submitDisabled}
              isLoading={isLoading}
              onClick={onSaveClick}
            >
              {editingFunnel ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (!showPreview) {
    return form
  }

  return (
    <div className='grid items-start gap-8 xl:grid-cols-2'>
      {form}
      <EventFunnelPreview
        activeGame={activeGame}
        steps={steps}
        maxGap={maxGapNum}
        lastUpdatedAt={previewLastUpdatedAt}
        onRefresh={previewOnRefresh}
        refreshing={previewRefreshing}
      />
    </div>
  )
}
