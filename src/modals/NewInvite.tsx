import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { KeyedMutator } from 'swr'
import { z } from 'zod'
import createInvite from '../api/createInvite'
import { currentOrganisationSchema } from '../api/useOrganisation'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import Select from '../components/Select'
import TextInput from '../components/TextInput'
import { UserType } from '../entities/user'
import buildError from '../utils/buildError'

const validationSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  userType: z.object({
    label: z.string(),
    value: z.nativeEnum(UserType),
    desc: z.string(),
  }),
})

type FormValues = z.infer<typeof validationSchema>

const userTypeOptions = [
  {
    label: 'Developer',
    value: UserType.DEV,
    desc: 'Developers can create entities such as trackable stats and also update entities like players and leaderboard entries',
  },
  {
    label: 'Admin',
    value: UserType.ADMIN,
    desc: 'Admins can perform destructive actions such as deleting leaderboards but can also create access keys and export data',
  },
]

type NewInviteProps = {
  modalState: [boolean, Dispatch<React.SetStateAction<boolean>>]
  mutate: KeyedMutator<z.infer<typeof currentOrganisationSchema>>
}

export default function NewInvite({ modalState, mutate }: NewInviteProps) {
  const [, setOpen] = modalState
  const [isLoading, setLoading] = useState(false)
  const [apiError, setAPIError] = useState<TaloError | null>(null)

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      userType: userTypeOptions[0],
    },
    mode: 'onChange',
  })

  const onCreateClick: SubmitHandler<FormValues> = async (formData, e) => {
    e?.preventDefault()
    setLoading(true)
    setAPIError(null)

    try {
      const { invite } = await createInvite(formData.email, formData.userType.value)

      await mutate((data) => {
        if (!data) {
          throw new Error('Current organisation data not set')
        }

        return {
          ...data,
          pendingInvites: [...data.pendingInvites, invite],
        }
      }, false)

      setOpen(false)
    } catch (err) {
      setAPIError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <Modal id='new-invite' title='New invite' modalState={modalState} scroll={false}>
      <form onSubmit={handleSubmit(onCreateClick)}>
        <div className='space-y-4 p-4'>
          <TextInput
            id='email'
            variant='modal'
            label='Email'
            placeholder='user@example.com'
            inputExtra={{ ...register('email') }}
            errors={[errors.email?.message]}
          />

          <div className='w-full'>
            <label htmlFor='user-type' className='mb-1 block font-semibold'>
              User type
            </label>

            <Controller
              name='userType'
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Select {...field} innerRef={ref} inputId='user-type' options={userTypeOptions} />
              )}
            />
          </div>

          {apiError && <ErrorMessage error={apiError} />}
        </div>

        <div className='flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='w-full md:w-32'>
            <Button disabled={!isValid} isLoading={isLoading}>
              Create
            </Button>
          </div>

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
