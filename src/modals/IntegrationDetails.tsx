import { useState, useContext, MouseEvent } from 'react'
import Modal from '../components/Modal'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Toggle from '../components/toggles/Toggle'
import TextInput from '../components/TextInput'
import { upperFirst } from 'lodash-es'
import enableIntegration from '../api/enableIntegration'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import disableIntegration from '../api/disableIntegration'
import updateIntegration from '../api/updateIntegration'
import Loading from '../components/Loading'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import Link from '../components/Link'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Integration, SteamIntegrationConfig } from '../entities/integration'
import { KeyedMutator } from 'swr'
import { z } from 'zod'

const toastMessageConfigKeyMap = (newValue: boolean) => ({
  apiKey: 'Key successfully updated',
  appId: 'App ID successfully updated',
  syncLeaderboards: 'Leaderboard syncing successfully turned ' + (newValue ? 'on' : 'off'),
  syncStats: 'Stat syncing successfully turned ' + (newValue ? 'on' : 'off')
} as { [key: string]: string })

const validationSchema = z.object({
  apiKey: z.string().length(32, { message: 'Key must be 32 characters long' }).min(1, { message: 'Key is required' }),
  appId: z.number({ invalid_type_error: 'App ID must be a number', required_error: 'App ID is required' }),
  syncLeaderboards: z.boolean({ required_error: 'Sync leaderboards is required' }),
  syncStats: z.boolean({ required_error: 'Sync stats is required' })
})

type FormValues = z.infer<typeof validationSchema>

type IntegrationDetailsProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<{ integrations: Integration[] }>
  editingIntegration: Partial<Integration> | null
}

export default function IntegrationDetails({
  modalState,
  mutate,
  editingIntegration
}: IntegrationDetailsProps) {
  const toast = useContext(ToastContext)

  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [isUpdating, setUpdating] = useState<string | null>(null)
  const [isDeleting, setDeleting] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { register, handleSubmit, formState: { isValid, errors }, watch, control } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      apiKey: '',
      appId: editingIntegration?.config?.appId,
      syncLeaderboards: editingIntegration?.config?.syncLeaderboards ?? true,
      syncStats: editingIntegration?.config?.syncStats ?? true
    },
    mode: 'onChange'
  })

  const [apiKey, appId] = watch(['apiKey', 'appId'])

  const enabled = Boolean(editingIntegration?.id)

  const updateConfig = async (partial: Partial<FormValues>) => {
    const key = Object.keys(partial)[0]
    setUpdating(key)
    setError(null)

    try {
      const { integration } = await updateIntegration(activeGame.id, editingIntegration!.id!, { config: partial })

      mutate((data) => {
        return {
          ...data,
          integrations: data!.integrations.map((existingIntegration) => {
            if (existingIntegration.id === integration.id) return integration
            return existingIntegration
          })
        }
      }, false)

      setUpdating(null)

      const value = Object.values(partial)[0]
      toast.trigger(toastMessageConfigKeyMap(Boolean(value))[key], ToastType.SUCCESS)
    } catch (err) {
      setError(buildError(err))
      setUpdating(null)
    }
  }

  const onSyncLeaderboardsToggle = async (sync: boolean, formCallback: (...event: unknown[]) => void) => {
    formCallback(sync)

    if (enabled) {
      await updateConfig({ syncLeaderboards: sync })
    }
  }

  const onSyncStatsToggle = async (sync: boolean, formCallback: (...event: unknown[]) => void) => {
    formCallback(sync)

    if (enabled) {
      await updateConfig({ syncStats: sync })
    }
  }

  const onEnableClick: SubmitHandler<SteamIntegrationConfig> = async (formData, e) => {
    e?.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { integration } = await enableIntegration(activeGame.id, {
        type: editingIntegration!.type!,
        config: formData
      })

      mutate((data) => {
        return {
          ...data,
          integrations: [
            ...data!.integrations,
            integration
          ]
        }
      }, false)

      setOpen(false)

      toast.trigger(`${upperFirst(editingIntegration!.type)} integration successfully enabled`, ToastType.SUCCESS)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  const onDeleteClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setDeleting(true)
    setError(null)

    try {
      await disableIntegration(activeGame.id, editingIntegration!.id!)

      mutate((data) => {
        return {
          ...data,
          integrations: data!.integrations.filter((integration) => integration.id !== editingIntegration!.id)
        }
      }, false)

      setOpen(false)

      toast.trigger(`${upperFirst(editingIntegration!.type)} integration successfully disabled`, ToastType.SUCCESS)
    } catch (err) {
      setError(buildError(err))
      setDeleting(false)
    }
  }

  return (
    <Modal
      id='integration-details'
      title={`${upperFirst(editingIntegration?.type)} integration`}
      modalState={modalState}
    >
      <form onSubmit={handleSubmit(onEnableClick)}>
        <div className='p-4 space-y-4'>
          <span>To learn more about how the integration works, <Link to='https://docs.trytalo.com/docs/integrations/steamworks'>visit the docs</Link></span>

          <hr />

          <div className='space-y-4'>
            <TextInput
              id='api-key'
              variant='modal'
              label='Publisher API key'
              placeholder={enabled ? 'Enter a new key to override the existing one' : 'e.g. 8C9906B42D144BA9B785DC8E2F7DADEF'}
              inputExtra={{ ...register('apiKey') }}
              errors={[errors.apiKey?.message]}
            />

            {enabled &&
              <div className='w-full md:w-36 ml-auto'>
                <Button
                  type='button'
                  disabled={Boolean(errors.apiKey) || Boolean(isUpdating)}
                  isLoading={isUpdating === 'apiKey'}
                  onClick={() => updateConfig({ apiKey })}
                >
                  Update key
                </Button>
              </div>
            }
          </div>

          <div className='space-y-4'>
            <TextInput
              id='app-id'
              variant='modal'
              label='Game app ID'
              placeholder='e.g. 375290'
              inputExtra={{ ...register('appId', { valueAsNumber: true }) }}
              errors={[errors.appId?.message]}
            />

            {enabled &&
              <div className='w-full md:w-36 ml-auto'>
                <Button
                  type='button'
                  disabled={Boolean(errors.appId || isUpdating)}
                  isLoading={isUpdating === 'appId'}
                  onClick={() => updateConfig({ appId })}
                >
                  Update app ID
                </Button>
              </div>
            }
          </div>

          <hr />

          <div className='flex justify-between items-start'>
            <div>
              <label htmlFor='sync-leaderboards' className='font-semibold'>Sync leaderboards</label>
              <p className='text-sm text-gray-500'>Push leaderboard entries to Steam</p>
            </div>
            <div className='flex items-center space-x-4'>
              {isUpdating === 'syncLeaderboards' && <Loading size={24} thickness={180} />}
              <Controller
                control={control}
                name='syncLeaderboards'
                render={({
                  field: { onChange, value, ref }
                }) => (
                  <Toggle
                    id='sync-leaderboards'
                    inputRef={ref}
                    enabled={value}
                    disabled={Boolean(isUpdating)}
                    onToggle={(sync) => onSyncLeaderboardsToggle(sync, onChange)}
                  />
                )}
              />
            </div>
          </div>

          <div className='flex justify-between items-start'>
            <div>
              <label htmlFor='sync-stats' className='font-semibold'>Sync stats</label>
              <p className='text-sm text-gray-500'>Push individual and global values to Steam</p>
            </div>
            <div className='flex items-center space-x-4'>
              {isUpdating === 'syncStats' && <Loading size={24} thickness={180} />}
              <Controller
                control={control}
                name='syncStats'
                render={({
                  field: { onChange, value, ref }
                }) => (
                  <Toggle
                    id='sync-stats'
                    inputRef={ref}
                    enabled={value}
                    disabled={Boolean(isUpdating)}
                    onToggle={(sync) => onSyncStatsToggle(sync, onChange)}
                  />
                )}
              />
            </div>
          </div>

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          {!enabled &&
            <div className='w-full md:w-32'>
              <Button
                disabled={!isValid}
                isLoading={isLoading}
              >
                Enable
              </Button>
            </div>
          }

          {enabled &&
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
          }

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
