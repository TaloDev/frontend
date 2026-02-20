import { ChangeEvent, useCallback, useContext, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { KeyedMutator } from 'swr'
import updateAPIKey from '../api/updateAPIKey'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { APIKey } from '../entities/apiKey'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState, { AuthedUser } from '../state/userState'
import buildError from '../utils/buildError'
import { formatAPIKeyScopeGroup } from '../utils/formatAPIKeyScopeGroup'

type ScopesProps = {
  modalState: [boolean, (open: boolean) => void]
  selectedKey: APIKey | null
  availableScopes: Record<string, string[]>
  mutate: KeyedMutator<{ apiKeys: APIKey[]; scopes: Record<string, string[]> }>
}

export default function Scopes({ modalState, selectedKey, availableScopes, mutate }: ScopesProps) {
  const [, setOpen] = modalState

  const toast = useContext(ToastContext)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const user = useRecoilValue(userState) as AuthedUser

  const [selectedScopes, setSelectedScopes] = useState(selectedKey?.scopes ?? [])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)

  const onScopeChecked = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedScopes([...selectedScopes, e.target.value])
      } else {
        setSelectedScopes(selectedScopes.filter((s) => s !== e.target.value))
      }
    },
    [selectedScopes],
  )

  const onAllScopesSelected = useCallback(() => {
    const allScopes = Object.values(availableScopes).flat()
    setSelectedScopes(allScopes)
  }, [availableScopes])

  const onUpdateClick = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { apiKey } = await updateAPIKey(activeGame.id, selectedKey!.id, {
        scopes: selectedScopes,
      })

      await mutate((data) => {
        if (!data) {
          throw new Error('API key data is not set')
        }

        return {
          ...data,
          apiKeys: data.apiKeys.map((k) => {
            if (k.id === selectedKey!.id) return apiKey
            return k
          }),
        }
      })

      toast.trigger('Access key scopes updated', ToastType.SUCCESS)
      setOpen(false)
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  }, [activeGame.id, selectedKey, selectedScopes, mutate, toast, setOpen])

  return (
    <Modal id='scopes' title='Access key scopes' modalState={modalState}>
      <div>
        <div className='space-y-4 p-4'>
          <div className='grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2'>
            {availableScopes &&
              Object.keys(availableScopes).map((group) => (
                <div key={group} className='rounded bg-gray-100 p-4'>
                  <h4 className='font-semibold'>{formatAPIKeyScopeGroup(group)}</h4>
                  {availableScopes[group].map((scope: string) => (
                    <div key={scope}>
                      <input
                        id={`modal-${scope}`}
                        type='checkbox'
                        onChange={onScopeChecked}
                        checked={
                          Boolean(selectedScopes.find((s) => s === scope)) ||
                          selectedScopes.includes('*')
                        }
                        value={scope}
                      />
                      <label htmlFor={`modal-${scope}`} className='ml-2'>
                        {scope}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
          </div>
          <Button className='w-auto!' variant='black' onClick={onAllScopesSelected}>
            Select all scopes
          </Button>
          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='w-full md:w-32'>
            <Button disabled={!user.emailConfirmed} isLoading={isLoading} onClick={onUpdateClick}>
              Update
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
