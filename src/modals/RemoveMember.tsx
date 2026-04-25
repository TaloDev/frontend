import { useContext, useState } from 'react'
import { KeyedMutator } from 'swr'
import { z } from 'zod'
import { removeOrganisationMember } from '../api/removeOrganisationMember'
import { currentOrganisationSchema } from '../api/useOrganisation'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import ToastContext from '../components/toast/ToastContext'
import { User } from '../entities/user'
import buildError from '../utils/buildError'

type RemoveMemberProps = {
  modalState: [boolean, () => void]
  member: User
  organisationName: string
  mutate: KeyedMutator<z.infer<typeof currentOrganisationSchema>>
}

export function RemoveMember({ modalState, member, organisationName, mutate }: RemoveMemberProps) {
  const [, onClose] = modalState
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const toast = useContext(ToastContext)

  const onRemoveClick = async () => {
    setLoading(true)
    setError(null)

    try {
      await removeOrganisationMember(member.id)

      await mutate((data) => {
        if (!data) {
          throw new Error('Current organisation data not set')
        }

        return { ...data, members: data.members.filter((m) => m.id !== member.id) }
      }, false)

      toast.trigger(`Removed ${member.username} from the organisation`)
      onClose()
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <Modal
      id='remove-member'
      title={`Remove ${member.username}`}
      modalState={modalState}
      scroll={false}
    >
      <div className='flex grow flex-col'>
        <div className='space-y-4 p-4'>
          <p>
            <strong>{member.username}</strong> will be removed from the organisation. They will no
            longer have access to {organisationName}'s games. This action cannot be undone.
          </p>

          <TextInput
            id='confirm'
            variant='modal'
            label='Type "confirm" below'
            placeholder='confirm'
            onChange={setConfirmText}
            value={confirmText}
          />

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='mt-auto flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='w-full md:w-32'>
            <Button
              type='button'
              isLoading={isLoading}
              disabled={confirmText !== 'confirm'}
              onClick={onRemoveClick}
              variant='red'
            >
              Remove
            </Button>
          </div>
          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={onClose}>
              Back
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
