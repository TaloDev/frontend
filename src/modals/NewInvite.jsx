import { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage from '../components/ErrorMessage'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import createInvite from '../api/createInvite'
import Select from '../components/Select'
import userTypes from '../constants/userTypes'
import emailRegex from '../utils/validation/emailRegex'

const validationSchema = yup.object({
  email: yup.string().matches(emailRegex).label('Email').required(),
  userType: yup.object().label('User type').required()
})

const userTypeOptions = [
  { label: 'Developer', value: userTypes.DEV, desc: 'Developers can create entities such as trackable stats and also update entities like players and leaderboard entries' },
  { label: 'Admin', value: userTypes.ADMIN, desc: 'Admins can perform destructive actions such as deleting leaderboards but can also create access keys and export data' }
]

const NewInvite = ({ modalState, mutate }) => {
  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { register, handleSubmit, formState: { isValid, errors }, control } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      userType: userTypeOptions[0]
    },
    mode: 'onChange'
  })

  const onCreateClick = async (data, e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await createInvite(data.email, data.userType.value)

      mutate((data) => {
        return {
          ...data,
          pendingInvites: [
            ...data.pendingInvites,
            res.data.invite
          ]
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <Modal
      id='new-invite'
      title='New invite'
      modalState={modalState}
      scroll={false}
    >
      <form onSubmit={handleSubmit(onCreateClick)}>
        <div className='p-4 space-y-4'>
          <TextInput
            id='email'
            variant='modal'
            label='Email'
            placeholder='user@example.com'
            inputExtra={{ ...register('email') }}
            errors={[errors.email?.message]}
          />

          <div className='w-full'>
            <label htmlFor='sort-mode' className='block font-semibold mb-1'>User type</label>

            <Controller
              name='userType'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId='sort-mode'
                  options={userTypeOptions}
                />
              )}
            />
          </div>

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          <div className='w-full md:w-32'>
            <Button
              disabled={!isValid}
              isLoading={isLoading}
            >
              Create
            </Button>
          </div>

          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

NewInvite.propTypes = {
  modalState: PropTypes.array.isRequired,
  mutate: PropTypes.func.isRequired
}

export default NewInvite
