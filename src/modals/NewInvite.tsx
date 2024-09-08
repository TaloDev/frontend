import { Dispatch, useState } from 'react'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import buildError from '../utils/buildError'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import createInvite from '../api/createInvite'
import Select from '../components/Select'
import { UserType } from '../entities/user'
import { KeyedMutator } from 'swr'
import { z } from 'zod'
import { currentOrganisationSchema } from '../api/useOrganisation'

const validationSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  userType: z.object({
    label: z.string(),
    value: z.nativeEnum(UserType),
    desc: z.string()
  })
})

type FormValues = z.infer<typeof validationSchema>

const userTypeOptions = [
  { label: 'Developer', value: UserType.DEV, desc: 'Developers can create entities such as trackable stats and also update entities like players and leaderboard entries' },
  { label: 'Admin', value: UserType.ADMIN, desc: 'Admins can perform destructive actions such as deleting leaderboards but can also create access keys and export data' }
]

type NewInviteProps = {
  modalState: [boolean, Dispatch<React.SetStateAction<boolean>>]
  mutate: KeyedMutator<z.infer<typeof currentOrganisationSchema>>
}

export default function NewInvite({
  modalState,
  mutate
}: NewInviteProps) {
  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const { register, handleSubmit, formState: { isValid, errors }, control } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      userType: userTypeOptions[0]
    },
    mode: 'onChange'
  })

  const onCreateClick: SubmitHandler<FormValues> = async (formData, e) => {
    e?.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { invite } = await createInvite(formData.email, formData.userType.value)

      mutate((data) => {
        if (!data) {
          throw new Error('Current organisation data not set')
        }

        return {
          ...data,
          pendingInvites: [
            ...data.pendingInvites,
            invite
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
              render={({ field: { ref, ...field } }) => (
                <Select
                  {...field}
                  innerRef={ref}
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
