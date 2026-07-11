import { IconCopy } from '@tabler/icons-react'
import { useAtomValue } from 'jotai'
import { ChangeEvent, useContext, useState } from 'react'
import { KeyedMutator } from 'swr'
import createAPIKey from '../api/createAPIKey'
import updateAPIKey from '../api/updateAPIKey'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { APIKey } from '../entities/apiKey'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'
import { userState, AuthedUser } from '../state/userState'
import buildError from '../utils/buildError'
import { formatPascalCaseName } from '../utils/formatPascalCaseName'

type APIKeyDetailsProps = {
  modalState: [boolean, (open: boolean) => void]
  editingKey: APIKey | null
  availableScopes: Record<string, string[]>
  mutate: KeyedMutator<{ apiKeys: APIKey[]; scopes: Record<string, string[]> }>
}

export default function APIKeyDetails({
  modalState,
  editingKey,
  availableScopes,
  mutate,
}: APIKeyDetailsProps) {
  const [, setOpen] = modalState

  const toast = useContext(ToastContext)

  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame
  const user = useAtomValue(userState) as AuthedUser

  const [selectedScopes, setSelectedScopes] = useState(editingKey?.scopes ?? [])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)
  const [createdToken, setCreatedToken] = useState<string | null>(null)

  const expandWildcard = (scopes: string[]) => {
    return scopes.includes('*') ? Object.values(availableScopes).flat() : scopes
  }

  const onScopeChecked = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedScopes([...selectedScopes, e.target.value])
    } else {
      setSelectedScopes(expandWildcard(selectedScopes).filter((s) => s !== e.target.value))
    }
  }

  const onAllScopesSelected = () => {
    const allScopes = Object.values(availableScopes).flat()
    setSelectedScopes(allScopes)
  }

  const onNoScopesSelected = () => {
    setSelectedScopes([])
  }

  const onGroupChecked = (group: string) => (checked: boolean) => {
    const groupScopes = availableScopes[group]
    setSelectedScopes(
      checked
        ? [
            ...expandWildcard(selectedScopes).filter((s) => !groupScopes.includes(s)),
            ...groupScopes,
          ]
        : expandWildcard(selectedScopes).filter((s) => !groupScopes.includes(s)),
    )
  }

  const onCreateClick = async () => {
    setLoading(true)
    setError(null)

    try {
      const { apiKey, token } = await createAPIKey(activeGame.id, selectedScopes)

      await mutate((data) => {
        if (!data) {
          throw new Error('Access key data is not set')
        }

        return {
          ...data,
          apiKeys: [...data.apiKeys, apiKey],
        }
      })

      setCreatedToken(token)
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  const onUpdateClick = async () => {
    setLoading(true)
    setError(null)

    try {
      const { apiKey } = await updateAPIKey(activeGame.id, editingKey!.id, {
        scopes: selectedScopes,
      })

      await mutate((data) => {
        if (!data) {
          throw new Error('Access key data is not set')
        }

        return {
          ...data,
          apiKeys: data.apiKeys.map((k) => {
            if (k.id === editingKey!.id) return apiKey
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
  }

  return (
    <Modal
      id='api-key-details'
      title={editingKey ? 'Update access key' : 'Create access key'}
      modalState={modalState}
      footer={
        <div className='flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          {createdToken ? (
            <>
              <div className='w-full md:w-32'>
                <Button onClick={() => setOpen(false)}>Done</Button>
              </div>
              <div className='w-full md:w-32'>
                <Button
                  className='w-auto!'
                  variant='grey'
                  onClick={async () => {
                    await navigator.clipboard.writeText(createdToken!)
                    toast.trigger('Access key copied to clipboard')
                  }}
                  icon={<IconCopy />}
                >
                  <span>Copy</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className='w-full md:w-32'>
                <Button
                  disabled={!user.emailConfirmed || (!editingKey && selectedScopes.length === 0)}
                  isLoading={isLoading}
                  onClick={editingKey ? onUpdateClick : onCreateClick}
                >
                  {editingKey ? 'Update' : 'Create'}
                </Button>
              </div>
              <div className='w-full md:w-32'>
                <Button variant='grey' onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      }
    >
      <div>
        {createdToken ? (
          <div className='space-y-4 p-4'>
            <div>
              <h3 className='font-semibold'>Your new key</h3>
              <AlertBanner
                className='mt-2 text-white'
                text="Save this key somewhere safe. It won't be shown again."
              />
            </div>
            <div className='rounded border border-gray-300 bg-gray-100 p-4 wrap-break-word'>
              <code>{createdToken}</code>
            </div>
            {error && <ErrorMessage error={error} />}
          </div>
        ) : (
          <div className='space-y-4 p-4'>
            <div className='mb-2!'>
              <h3 className='font-semibold'>Scopes</h3>
              <p className='text-sm'>Scopes control what your access key can do</p>
            </div>
            <div className='grid max-h-80 grid-cols-1 gap-4 overflow-y-auto rounded border border-gray-200 p-4 md:grid-cols-2'>
              {availableScopes &&
                Object.keys(availableScopes)
                  .sort((a, b) => {
                    if (a === 'players') return -1
                    if (b === 'players') return 1
                    return a.localeCompare(b)
                  })
                  .map((group) => {
                    const allSelected =
                      selectedScopes.includes('*') ||
                      availableScopes[group].every((s) => selectedScopes.includes(s))
                    const selectedCount = availableScopes[group].filter((s) =>
                      selectedScopes.includes(s),
                    ).length
                    return (
                      <div
                        key={group}
                        className='overflow-hidden rounded border border-gray-300 text-sm '
                      >
                        <label className='flex cursor-pointer items-center gap-2 bg-gray-100 p-2 font-semibold'>
                          <input
                            id={`modal-group-${group}`}
                            type='checkbox'
                            checked={allSelected}
                            ref={(el) => {
                              if (el) {
                                el.indeterminate = !allSelected && selectedCount > 0
                              }
                            }}
                            onChange={(e) => onGroupChecked(group)(e.target.checked)}
                          />
                          {formatPascalCaseName(group)}
                        </label>
                        <div className='flex items-center gap-4 border-t border-gray-300 p-2'>
                          {availableScopes[group].map((scope: string) => (
                            <div key={scope} className='flex items-center'>
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
                                {scope.split(':')[0]}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
            </div>
            <div className='flex gap-2'>
              <Button className='w-auto!' variant='black' onClick={onAllScopesSelected}>
                Select all scopes
              </Button>
              <Button className='w-auto!' variant='black' onClick={onNoScopesSelected}>
                Deselect all scopes
              </Button>
            </div>
            {error && <ErrorMessage error={error} />}
          </div>
        )}
      </div>
    </Modal>
  )
}
