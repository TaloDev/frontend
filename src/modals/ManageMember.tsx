import { useContext, useState } from 'react'
import { KeyedMutator } from 'swr'
import { z } from 'zod'
import { changeMemberType } from '../api/changeMemberType'
import { currentOrganisationSchema } from '../api/useOrganisation'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import Select, { SelectOption } from '../components/Select'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { userTypeArticle, userTypeMap, userTypeOptions } from '../constants/userTypeMap'
import { User, UserType } from '../entities/user'
import buildError from '../utils/buildError'

type ManageMemberProps = {
  modalState: [boolean, (open: boolean) => void]
  member: User
  mutate: KeyedMutator<z.infer<typeof currentOrganisationSchema>>
  onRemoveClick: () => void
}

export function ManageMember({ modalState, member, mutate, onRemoveClick }: ManageMemberProps) {
  const [, setOpen] = modalState
  const [type, setType] = useState<SelectOption<UserType>>(
    userTypeOptions.find((option) => option.value === member.type) ?? userTypeOptions[0],
  )
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const toast = useContext(ToastContext)

  const currentLabel = userTypeMap[member.type]
  const article = userTypeArticle[member.type]

  const onChangeTypeClick = async () => {
    setLoading(true)
    setError(null)

    try {
      const { user } = await changeMemberType(member.id, type.value)

      await mutate((data) => {
        if (!data) {
          throw new Error('Current organisation data not set')
        }

        return {
          ...data,
          members: data.members.map((m) => (m.id === member.id ? user : m)),
        }
      }, false)

      toast.trigger('User updated', ToastType.SUCCESS)
      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <Modal
      id='manage-member'
      title={`Manage ${member.username}`}
      modalState={modalState}
      className='flex flex-col'
      footer={
        <div className='mt-auto flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='flex space-x-2'>
            <div className='w-full md:w-32'>
              <Button type='button' variant='red' onClick={onRemoveClick}>
                Remove
              </Button>
            </div>
            <div className='w-full md:w-40'>
              <Button
                type='button'
                disabled={type.value === member.type}
                isLoading={isLoading}
                onClick={onChangeTypeClick}
              >
                Change type
              </Button>
            </div>
          </div>
          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <form className='flex grow flex-col'>
        <div className='space-y-4 p-4'>
          <div className='w-full'>
            <label htmlFor='user-type' className='mb-1 block font-semibold'>
              User type
            </label>
            <p className='mb-2 text-sm text-gray-500'>
              {member.username} is currently {article} {currentLabel}
            </p>

            <Select
              inputId='user-type'
              options={userTypeOptions}
              value={type}
              onChange={(option) => option && setType(option)}
            />
          </div>

          {error && <ErrorMessage error={error} />}
        </div>
      </form>
    </Modal>
  )
}
