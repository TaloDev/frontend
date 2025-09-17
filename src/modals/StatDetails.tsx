import { useState } from 'react'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import RadioGroup from '../components/RadioGroup'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState, { AuthedUser } from '../state/userState'
import { useRecoilValue } from 'recoil'
import createStat from '../api/createStat'
import updateStat from '../api/updateStat'
import deleteStat from '../api/deleteStat'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import nullableNumber from '../utils/validation/nullableNumber'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'
import { GameStat } from '../entities/gameStat'
import { KeyedMutator } from 'swr'
import { z } from 'zod'
import { IconRefresh, IconTrash } from '@tabler/icons-react'

type StatDetailsProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<{ stats: GameStat[] }>
  editingStat: GameStat | null
  onResetClick?: () => void
}

const validationSchema = z.object({
  internalName: z.string().min(1, { message: 'Internal name is required' }),
  name: z.string().min(1, { message: 'Display name is required' }),
  minTimeBetweenUpdates: z.number({
    required_error: 'Time between updates is required',
    invalid_type_error: 'Time between updates must be a number'
  }).min(0, 'Time between updates must be greater than or equal to 0'),
  minValue: z.number({
    invalid_type_error: 'Min value must be a number'
  }).nullable(),
  defaultValue: z.number({
    required_error: 'Default value is required',
    invalid_type_error: 'Default value must be a number'
  }),
  maxValue: z.number({
    invalid_type_error: 'Max value must be a number'
  }).nullable(),
  maxChange: z.number({
    invalid_type_error: 'Max change must be a number'
  }).gte(1, 'Max change must be greater than or equal to 1').nullable()
}).superRefine(({ minValue, maxValue, defaultValue }, ctx) => {
  let valid = true

  if (minValue !== null && maxValue !== null && maxValue <= minValue) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: minValue + 1,
      type: 'number',
      inclusive: false,
      message: 'Max value must be more than the min value',
      path: ['maxValue']
    })
    valid = false
  }

  if (minValue !== null && defaultValue < minValue) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: minValue,
      type: 'number',
      inclusive: false,
      message: 'Default value must be more than the min value',
      path: ['defaultValue']
    })
    valid = false
  }

  if (maxValue !== null && defaultValue > maxValue) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: maxValue,
      type: 'number',
      inclusive: false,
      message: 'Default value must be less than the max value',
      path: ['defaultValue']
    })
    valid = false
  }

  return valid
})

type FormValues = z.infer<typeof validationSchema>

const StatDetails = ({
  modalState,
  mutate,
  editingStat,
  onResetClick
}: StatDetailsProps) => {
  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [apiError, setAPIError] = useState<TaloError | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const user = useRecoilValue(userState) as AuthedUser

  const [global, setGlobal] = useState(editingStat?.global ?? false)

  const { register, handleSubmit, formState: { isValid, errors } } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      internalName: editingStat?.internalName ?? '',
      name: editingStat?.name ?? '',
      minTimeBetweenUpdates: editingStat?.minTimeBetweenUpdates ?? 0,
      minValue: editingStat?.minValue ?? null,
      defaultValue: editingStat?.defaultValue,
      maxValue: editingStat?.maxValue ?? null,
      maxChange: editingStat?.maxChange ?? null
    },
    mode: 'onChange'
  })

  const onCreateClick: SubmitHandler<FormValues> = async (FormValues, e) => {
    e?.preventDefault()
    setLoading(true)
    setAPIError(null)

    try {
      const { stat } = await createStat(activeGame.id, { ...FormValues, global })

      mutate((data) => {
        return {
          ...data,
          stats: [
            ...data!.stats,
            stat
          ]
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setAPIError(buildError(err))
      setLoading(false)
    }
  }

  const onUpdateClick: SubmitHandler<FormValues> = async (FormValues, e) => {
    e?.preventDefault()
    setLoading(true)
    setAPIError(null)

    try {
      const { stat } = await updateStat(activeGame.id, editingStat!.id, { ...FormValues, global })

      mutate((data) => {
        return {
          ...data,
          stats: data!.stats.map((existingStat) => {
            if (existingStat.id === stat.id) return stat
            return existingStat
          })
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setAPIError(buildError(err))
      setLoading(false)
    }
  }

  const onDeleteClick = async () => {
    /* v8ignore next */
    if (!window.confirm('Are you sure you want to delete this stat?')) return

    setDeleting(true)
    setAPIError(null)

    try {
      await deleteStat(activeGame.id, editingStat!.id)

      mutate((data) => {
        return {
          ...data,
          stats: data!.stats.filter((existingStat) => {
            return existingStat.id !== editingStat!.id
          })
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setAPIError(buildError(err))
      setDeleting(false)
    }
  }

  return (
    <Modal
      id='stat-details'
      title={editingStat ? 'Update stat' : 'Create stat'}
      modalState={modalState}
    >
      <form onSubmit={handleSubmit(editingStat ? onUpdateClick : onCreateClick)}>
        <div className='p-4 space-y-4'>
          <TextInput
            id='internal-name'
            disabled={Boolean(editingStat)}
            variant='modal'
            label='Internal name'
            placeholder='The unique identifier for this stat'
            inputExtra={{ ...register('internalName') }}
            errors={[errors.internalName?.message]}
          />

          <TextInput
            id='display-name'
            variant='modal'
            label='Display name'
            placeholder='The public-facing name of this stat'
            inputExtra={{ ...register('name') }}
            errors={[errors.name?.message]}
          />

          <RadioGroup
            label='Global'
            name='global'
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ]}
            onChange={setGlobal}
            value={global}
            info='Global stats display an aggregated value from all players'
          />

          <div>
            <TextInput
              id='min-time-between-updates'
              type='number'
              variant='modal'
              label='Min time between updates'
              placeholder='Seconds'
              inputExtra={{
                ...register('minTimeBetweenUpdates', { valueAsNumber: true }),
                step: 'any'
              }}
              containerClassName='max-w-xs'
              errors={[errors.minTimeBetweenUpdates?.message]}
            />
            <p className='mt-2 text-sm text-gray-500'>Seconds required to have elapsed between stat updates for a player</p>

          </div>

          <div className='border-t border-b py-4 md:py-0 border-gray-200 md:border-none'>
            <div className='space-y-4 md:space-y-0 md:flex md:space-x-4'>
              <TextInput
                id='min-value'
                type='number'
                variant='modal'
                label='Min value'
                placeholder='Optional'
                inputExtra={{
                  ...register('minValue', { deps: ['defaultValue', 'maxValue'], setValueAs: nullableNumber }),
                  step: 'any'
                }}
                inputClassName='md:max-w-[160px]'
                containerClassName='max-w-xs md:!w-auto'
              />

              <TextInput
                id='default-value'
                type='number'
                variant='modal'
                label='Default value'
                inputExtra={{
                  ...register('defaultValue', { setValueAs: nullableNumber }),
                  step: 'any'
                }}
                inputClassName='md:max-w-[160px]'
                containerClassName='max-w-xs md:!w-auto'
                errors={errors.defaultValue && ['']}
              />

              <TextInput
                id='max-value'
                type='number'
                variant='modal'
                label='Max value'
                placeholder='Optional'
                inputExtra={{
                  ...register('maxValue', { deps: ['defaultValue'], setValueAs: nullableNumber }),
                  step: 'any'
                }}
                inputClassName='md:max-w-[160px]'
                containerClassName='max-w-xs md:!w-auto'
                errors={errors.maxValue && ['']}
              />
            </div>

            <div>
              {Object.keys(errors)
                .filter((key) => ['minValue', 'defaultValue', 'maxValue'].includes(key) && errors[key as keyof FormValues]?.message)
                .map((key, idx) => (
                  <p role='alert' key={idx} className='text-red-500 font-medium mt-2'>
                    {errors[key as keyof FormValues]?.message}
                  </p>
                ))}
            </div>
          </div>

          <TextInput
            id='max-change'
            type='number'
            variant='modal'
            label='Max change'
            placeholder='Optional'
            inputExtra={{
              ...register('maxChange', {
                setValueAs: (val) => val ? Number(val) : null /* can't use nullableNumber because it needs to be positive */
              }),
              step: 'any'
            }}
            containerClassName='max-w-xs'
            errors={[errors.maxChange?.message]}
          />

          {editingStat && canPerformAction(user, PermissionBasedAction.DELETE_STAT) &&
            <div className='p-4 space-y-2 bg-red-100 border border-red-400 rounded'>
              <p className='font-semibold'>Danger zone</p>

              <div className='space-y-2'>
                <p>Once taken, these actions are irreversible.</p>
                <div className='flex space-x-2'>
                  {onResetClick &&
                    <Button
                      type='button'
                      onClick={onResetClick}
                      variant='red'
                      className='!w-auto'
                      icon={<IconRefresh />}
                    >
                      <span>
                        Reset
                      </span>
                    </Button>
                  }

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
              </div>
            </div>
          }

          {apiError && <ErrorMessage error={apiError} />}
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          {!editingStat &&
            <div className='w-full md:w-32'>
              <Button
                disabled={!isValid}
                isLoading={isLoading}
              >
                Create
              </Button>
            </div>
          }
          {editingStat &&
            <div className='w-full md:w-32'>
              <Button
                disabled={!isValid || isDeleting}
                isLoading={isLoading}
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

export default StatDetails
