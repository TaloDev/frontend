import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useState, useContext, MouseEvent, useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { KeyedMutator } from 'swr'
import { z } from 'zod'
import createChannel from '../api/createChannel'
import deleteChannel from '../api/deleteChannel'
import updateChannel from '../api/updateChannel'
import { channelsSchema } from '../api/useChannels'
import usePlayers from '../api/usePlayers'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Loading from '../components/Loading'
import Modal from '../components/Modal'
import { SingleAlias } from '../components/PlayerAliases'
import Select from '../components/Select'
import TextInput from '../components/TextInput'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import Toggle from '../components/toggles/Toggle'
import { GameChannel } from '../entities/gameChannels'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState, { AuthedUser } from '../state/userState'
import buildError from '../utils/buildError'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'

const validationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  autoCleanup: z.boolean(),
  private: z.boolean(),
  temporaryMembership: z.boolean(),
  ownerAliasId: z.number().nullable(),
})

type FormValues = z.infer<typeof validationSchema>

type ChannelDetailsProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<z.infer<typeof channelsSchema>>
  editingChannel: Partial<GameChannel> | null
}

export default function ChannelDetails({
  modalState,
  mutate,
  editingChannel,
}: ChannelDetailsProps) {
  const toast = useContext(ToastContext)

  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [apiError, setAPIError] = useState<TaloError | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const [ownerSearch, setOwnerSearch] = useState('')
  const { players } = usePlayers(activeGame, ownerSearch, 0)

  const [isMenuOpen, setMenuOpen] = useState(false)

  const user = useRecoilValue(userState) as AuthedUser

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: editingChannel?.name || '',
      autoCleanup: editingChannel?.autoCleanup ?? false,
      private: editingChannel?.private ?? false,
      temporaryMembership: editingChannel?.temporaryMembership ?? false,
      ownerAliasId: editingChannel?.owner?.id || null,
    },
    mode: 'onChange',
  })

  const isEditing = Boolean(editingChannel?.id)

  const onSubmit: SubmitHandler<FormValues> = async (formData, e) => {
    e?.preventDefault()
    setLoading(true)
    setAPIError(null)

    try {
      if (isEditing) {
        const { channel } = await updateChannel(activeGame.id, editingChannel!.id!, formData)

        await mutate((data) => {
          if (!data) {
            throw new Error('Channel data not set')
          }

          return {
            ...data,
            channels: data!.channels.map((existingChannel) => {
              if (existingChannel.id === channel.id) return channel
              return existingChannel
            }),
          }
        }, false)

        toast.trigger(`${channel.name} updated`, ToastType.SUCCESS)
        setOpen(false)
      } else {
        const { channel } = await createChannel(activeGame.id, formData)

        await mutate((data) => {
          if (!data) {
            throw new Error('Channel data not set')
          }

          return {
            ...data,
            channels: [...data!.channels, channel],
          }
        }, false)

        toast.trigger(`${channel.name} created`, ToastType.SUCCESS)
        setOpen(false)
      }
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
      await deleteChannel(activeGame.id, editingChannel!.id!)

      await mutate((data) => {
        if (!data) {
          throw new Error('Channel data not set')
        }

        return {
          ...data,
          channels: data!.channels.filter((channel) => channel.id !== editingChannel!.id),
        }
      }, false)

      setOpen(false)
      toast.trigger(`${editingChannel!.name} deleted`)
    } catch (err) {
      setAPIError(buildError(err))
      setDeleting(false)
    }
  }

  const playerOptions = useMemo(
    () =>
      players.flatMap((player) =>
        player.aliases.map((alias) => ({
          label: (
            <span className='flex items-center space-x-2'>
              <SingleAlias alias={alias} />
              <span className='text-sm font-normal'>{alias.identifier}</span>
            </span>
          ),
          value: alias.id,
        })),
      ),
    [players],
  )

  return (
    <Modal
      id='channel-details'
      title={isEditing ? 'Edit channel' : 'Create channel'}
      modalState={modalState}
      className={clsx('flex flex-col', {
        'md:h-[50vh]!': isMenuOpen,
      })}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='flex grow flex-col'>
        <div className='space-y-4 p-4'>
          <TextInput
            id='name'
            variant='modal'
            label='Channel name'
            placeholder='e.g. global-chat'
            inputExtra={{ ...register('name') }}
            errors={[errors.name?.message]}
          />

          <div className='w-full'>
            <label htmlFor='owner' className='mb-1 block font-semibold'>
              Channel owner
            </label>
            <Controller
              control={control}
              name='ownerAliasId'
              render={({ field: { onChange, value } }) => (
                <Select
                  isClearable
                  inputId='owner'
                  filterOption={() => true}
                  options={playerOptions}
                  value={playerOptions.find((option) => option.value === value)}
                  onChange={(option) => onChange(option?.value || null)}
                  onInputChange={setOwnerSearch}
                  placeholder='Search players...'
                  isLoading={isLoading}
                  noOptionsMessage={() => 'No players found'}
                  loadingMessage={() => <Loading />}
                  classNames={{
                    menuList: () => 'md:!max-h-[188px]',
                  }}
                  onMenuOpen={() => setMenuOpen(true)}
                  onMenuClose={() => setMenuOpen(false)}
                />
              )}
            />
          </div>

          <hr className='border-gray-200' />

          <div className='flex items-center justify-between'>
            <div>
              <label htmlFor='auto-cleanup' className='font-semibold'>
                Auto cleanup
              </label>
              <p className='text-sm text-gray-500'>
                Delete this channel when the owner or the last subscribed member leaves
              </p>
            </div>
            <Controller
              control={control}
              name='autoCleanup'
              render={({ field: { onChange, value, ref } }) => (
                <Toggle id='auto-cleanup' inputRef={ref} enabled={value} onToggle={onChange} />
              )}
            />
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <label htmlFor='private' className='font-semibold'>
                Private
              </label>
              <p className='text-sm text-gray-500'>
                Only the channel owner can invite players to this channel
              </p>
            </div>
            <Controller
              control={control}
              name='private'
              render={({ field: { onChange, value, ref } }) => (
                <Toggle id='private' inputRef={ref} enabled={value} onToggle={onChange} />
              )}
            />
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <label htmlFor='temporary-membership' className='font-semibold'>
                Temporary membership
              </label>
              <p className='text-sm text-gray-500'>
                Players will be removed from this channel when they close the game
              </p>
            </div>
            <Controller
              control={control}
              name='temporaryMembership'
              render={({ field: { onChange, value, ref } }) => (
                <Toggle
                  id='temporary-membership'
                  inputRef={ref}
                  enabled={value}
                  onToggle={onChange}
                />
              )}
            />
          </div>

          {apiError && <ErrorMessage error={apiError} />}
        </div>

        <div className='mt-auto flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          {!isEditing && (
            <div className='w-full md:w-32'>
              <Button disabled={!isValid} isLoading={isLoading}>
                Create
              </Button>
            </div>
          )}

          {isEditing && (
            <div className='flex space-x-2'>
              {canPerformAction(user, PermissionBasedAction.DELETE_CHANNEL) && (
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
              )}
              <div className='w-full md:w-32'>
                <Button disabled={!isValid} isLoading={isLoading}>
                  Update
                </Button>
              </div>
            </div>
          )}

          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
