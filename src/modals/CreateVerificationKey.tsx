import { useAtomValue } from 'jotai'
import { useCallback, useContext, useState } from 'react'
import { KeyedMutator } from 'swr'
import { createVerificationKey as create } from '../api/createVerificationKey'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { VerificationKey } from '../entities/verificationKey'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

type CreateVerificationKeyProps = {
  modalState: [boolean, (open: boolean) => void]
  mutate: KeyedMutator<{ verificationKeys: VerificationKey[] }>
}

export default function CreateVerificationKey({ modalState, mutate }: CreateVerificationKeyProps) {
  const [, setOpen] = modalState
  const toast = useContext(ToastContext)
  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame

  const [version, setVersion] = useState('')
  const [value, setValue] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const onCreateClick = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { verificationKey } = await create(activeGame.id, version, value)

      await mutate((data) => {
        if (!data) {
          throw new Error('Verification key data not set')
        }

        return {
          ...data,
          verificationKeys: [...data.verificationKeys, verificationKey],
        }
      })

      toast.trigger('Verification key created', ToastType.SUCCESS)
      setOpen(false)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }, [activeGame.id, version, value, mutate, toast, setOpen])

  return (
    <Modal id='create-verification-key' title='Create verification key' modalState={modalState}>
      <div>
        <div className='space-y-4 p-4'>
          <TextInput
            startFocused
            id='version'
            variant='modal'
            label='Version'
            placeholder='e.g. 1, 2.1, 2024-01, earlyaccess'
            onChange={setVersion}
            value={version}
          />

          <TextInput
            id='value'
            variant='modal'
            label='Value'
            placeholder='The verification key value'
            onChange={setValue}
            value={value}
          />

          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='w-full md:w-32'>
            <Button disabled={!version || !value} isLoading={isLoading} onClick={onCreateClick}>
              Create
            </Button>
          </div>
          <div className='w-full md:w-32'>
            <Button variant='grey' onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
