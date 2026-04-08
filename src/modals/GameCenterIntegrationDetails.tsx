import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useContext, MouseEvent } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { KeyedMutator } from 'swr'
import { z } from 'zod'
import disableIntegration from '../api/disableIntegration'
import enableIntegration from '../api/enableIntegration'
import updateIntegration from '../api/updateIntegration'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Link from '../components/Link'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { Integration, GameCenterIntegrationConfig } from '../entities/integration'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

const validationSchema = z.object({
  bundleId: z.string().min(1, { message: 'Bundle ID is required' }),
})

type FormValues = z.infer<typeof validationSchema>

type GameCenterIntegrationDetailsProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<{ integrations: Integration[] }>
  editingIntegration: Partial<Integration> | null
}

export function GameCenterIntegrationDetails({
  modalState,
  mutate,
  editingIntegration,
}: GameCenterIntegrationDetailsProps) {
  const toast = useContext(ToastContext)

  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [isUpdating, setUpdating] = useState<string | null>(null)
  const [isDeleting, setDeleting] = useState(false)
  const [apiError, setAPIError] = useState<TaloError | null>(null)
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      bundleId: '',
    },
    mode: 'onChange',
  })

  const [bundleId] = watch(['bundleId'])

  const enabled = Boolean(editingIntegration?.id)

  const updateConfig = async (partial: Partial<FormValues>) => {
    const key = Object.keys(partial)[0]
    setUpdating(key)
    setAPIError(null)

    try {
      const { integration } = await updateIntegration(activeGame.id, editingIntegration!.id!, {
        config: partial,
      })

      await mutate((data) => {
        return {
          ...data,
          integrations: data!.integrations.map((existingIntegration) => {
            if (existingIntegration.id === integration.id) return integration
            return existingIntegration
          }),
        }
      }, false)

      setUpdating(null)

      const keyLabels: { [key: string]: string } = {
        bundleId: 'Bundle ID successfully updated',
      }
      toast.trigger(keyLabels[key], ToastType.SUCCESS)
    } catch (err) {
      setAPIError(buildError(err))
      setUpdating(null)
    }
  }

  const onEnableClick: SubmitHandler<GameCenterIntegrationConfig> = async (formData, e) => {
    e?.preventDefault()
    setLoading(true)
    setAPIError(null)

    try {
      const { integration } = await enableIntegration(activeGame.id, {
        type: editingIntegration!.type!,
        config: formData,
      })

      await mutate((data) => {
        return {
          ...data,
          integrations: [...data!.integrations, integration],
        }
      }, false)

      setOpen(false)

      toast.trigger('Game Center integration successfully enabled', ToastType.SUCCESS)
    } catch (err) {
      setAPIError(buildError(err))
      setLoading(false)
    }
  }

  const onDeleteClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setDeleting(true)
    setAPIError(null)

    try {
      await disableIntegration(activeGame.id, editingIntegration!.id!)

      await mutate((data) => {
        return {
          ...data,
          integrations: data!.integrations.filter(
            (integration) => integration.id !== editingIntegration!.id,
          ),
        }
      }, false)

      setOpen(false)

      toast.trigger('Game Center integration successfully disabled')
    } catch (err) {
      setAPIError(buildError(err))
      setDeleting(false)
    }
  }

  return (
    <Modal
      id='game-center-integration-details'
      title='Game Center integration'
      modalState={modalState}
    >
      <form onSubmit={handleSubmit(onEnableClick)}>
        <div className='space-y-4 p-4'>
          <div>
            To learn more about how the integration works,{' '}
            <Link to='https://docs.trytalo.com/docs/integrations/game-center?utm_source=dashboard&utm_medium=integration-modal'>
              visit the docs
            </Link>
          </div>

          <div className='space-y-4'>
            <TextInput
              id='bundle-id'
              variant='modal'
              label='Bundle ID'
              placeholder={
                enabled
                  ? 'Enter a new bundle ID to override the existing one'
                  : 'e.g. com.example.game'
              }
              inputExtra={{ ...register('bundleId') }}
              errors={[errors.bundleId?.message]}
            />

            {enabled && (
              <div className='ml-auto w-full md:w-40'>
                <Button
                  type='button'
                  disabled={!bundleId || Boolean(errors.bundleId) || Boolean(isUpdating)}
                  className='whitespace-nowrap'
                  isLoading={isUpdating === 'bundleId'}
                  onClick={() => updateConfig({ bundleId })}
                >
                  Update bundle ID
                </Button>
              </div>
            )}
          </div>

          {apiError && <ErrorMessage error={apiError} />}
        </div>

        <div className='flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          {!enabled && (
            <div className='w-full md:w-32'>
              <Button disabled={!isValid} isLoading={isLoading}>
                Enable
              </Button>
            </div>
          )}

          {enabled && (
            <div className='w-full md:w-32'>
              <Button
                type='button'
                disabled={Boolean(isUpdating)}
                isLoading={isDeleting}
                onClick={onDeleteClick}
                variant='red'
              >
                Disable
              </Button>
            </div>
          )}

          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>
              {enabled ? 'Done' : 'Cancel'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
