import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage from '../components/ErrorMessage'
import RadioGroup from '../components/RadioGroup'
import activeGameState from '../state/activeGameState'
import userState from '../state/userState'
import { useRecoilValue } from 'recoil'
import userTypes from '../constants/userTypes'
import createStat from '../api/createStat'
import updateStat from '../api/updateStat'
import deleteStat from '../api/deleteStat'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import nullableNumber from '../utils/nullableNumber'

const StatDetails = ({ modalState, mutate, editingStat }) => {
  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const activeGame = useRecoilValue(activeGameState)

  const [global, setGlobal] = useState(editingStat?.global ?? false)

  const [range, setRange] = useState({
    min: editingStat?.minValue ?? null,
    max: editingStat?.maxValue ?? null
  })

  const validationSchema = useMemo(() => {
    return yup.object({
      internalName: yup.string().label('Internal name').required(),
      name: yup.string().label('Display name').required(),
      minTimeBetweenUpdates: yup.number()
        .label('Time between updates')
        .typeError('Time between updates must be a number')
        .min(0)
        .required(),
      minValue: yup.number()
        .label('Min value')
        .typeError('Min value must be a number')
        .nullable(),
      defaultValue: yup.number()
        .label('Default value')
        .typeError('Default value must be a number')
        .when('minValue', {
          is: (val) => Boolean(val),
          then: (schema) => schema.min(range.min, 'Default value must be more than the min value')
        })
        .when('maxValue', {
          is: (val) => Boolean(val),
          then: (schema) => schema.max(range.max, 'Default value must be less than the max value')
        })
        .required(),
      maxValue: yup.number()
        .label('Max value')
        .typeError('Max value must be a number')
        .nullable()
        .when('minValue', {
          is: (val) => val !== null,
          then: (schema) => schema.min(range.min + 1, 'Max value must be more than the min value')
        }),
      maxChange: yup.number()
        .label('Max change')
        .typeError('Max change must be a number')
        .positive()
        .nullable()
    })
  }, [range.min, range.max])

  const { register, handleSubmit, formState: { isValid, errors }, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      internalName: editingStat?.internalName ?? '',
      name: editingStat?.name ?? '',
      minTimeBetweenUpdates: editingStat?.minTimeBetweenUpdates ?? 0,
      minValue: editingStat?.minValue ?? null,
      defaultValue: editingStat?.defaultValue ?? null,
      maxValue: editingStat?.maxValue ?? null,
      maxChange: editingStat?.maxChange ?? null
    },
    mode: 'onChange'
  })

  useEffect(() => {
    const numberFromStringInput = (val) => {
      if (val === null || val === undefined) return null
      return Number(val)
    }

    const sub = watch((data) => {
      setRange({
        min: numberFromStringInput(data.minValue),
        max: numberFromStringInput(data.maxValue)
      })
    })
    return () => sub.unsubscribe()
  }, [watch])

  const user = useRecoilValue(userState)

  const onCreateClick = async (data, e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await createStat(activeGame.id, { ...data, global })

      mutate((data) => {
        return {
          ...data,
          stats: [
            ...data.stats,
            res.data.stat
          ]
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  const onUpdateClick = async (data, e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await updateStat(editingStat.id, { ...data, global })

      mutate((data) => {
        return {
          ...data,
          stats: data.stats.map((existingStat) => {
            if (existingStat.id === res.data.stat.id) return res.data.stat
            return existingStat
          })
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  const onDeleteClick = async () => {
    /* istanbul ignore if */
    if (!window.confirm('Are you sure you want to delete this stat?')) return

    setDeleting(true)
    setError(null)

    try {
      await deleteStat(editingStat.id)

      mutate((data) => {
        return {
          ...data,
          stats: data.stats.filter((existingStat) => {
            return existingStat.id !== editingStat.id
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
      id='stat-details'
      title={editingStat ? 'Update stat' : 'Create new stat'}
      modalState={modalState}
    >
      <form onSubmit={handleSubmit(editingStat ? onUpdateClick : onCreateClick)}>
        <div className='p-4 space-y-4'>
          <TextInput
            startFocused
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
                  ...register('minValue', { deps: ['defaultValue', 'maxValue'], valueAsNumber: true }),
                  step: 'any'
                }}
                inputClassName='md:max-w-[160px]'
                containerClassName='max-w-xs md:!w-auto'
                errors={errors.minValue && ['']}
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
                .filter((key) => ['minValue', 'defaultValue', 'maxValue'].includes(key) && errors[key]?.message)
                .map((key, idx) => (
                  <p role='alert' key={idx} className='text-red-500 font-medium mt-2'>{errors[key].message}</p>
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

          {error && <ErrorMessage error={error} />}
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
            <div className='flex space-x-2'>
              {user.type === userTypes.ADMIN &&
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
                  disabled={!isValid || isDeleting}
                  isLoading={isLoading}
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

StatDetails.propTypes = {
  modalState: PropTypes.array.isRequired,
  mutate: PropTypes.func.isRequired,
  editingStat: PropTypes.object
}

export default StatDetails
