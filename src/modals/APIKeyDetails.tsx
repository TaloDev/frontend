import { IconCopy } from '@tabler/icons-react'
import { useAtomValue } from 'jotai'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { KeyedMutator } from 'swr'
import { createAdminApiKey } from '../api/createAdminApiKey'
import { createAPIKey } from '../api/createAPIKey'
import { updateAdminApiKey } from '../api/updateAdminApiKey'
import { updateAPIKey } from '../api/updateAPIKey'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Modal from '../components/Modal'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { AdminApiKey } from '../entities/adminApiKey'
import { APIKey } from '../entities/apiKey'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'
import { userState, AuthedUser } from '../state/userState'
import buildError from '../utils/buildError'
import { formatPascalCaseName } from '../utils/formatPascalCaseName'

export type EditableKey =
  | {
      type: 'game'
      key: APIKey
    }
  | {
      type: 'admin'
      key: AdminApiKey
    }
  | null

type KeyType = 'game' | 'admin'

type KeysMutator<T extends APIKey | AdminApiKey> = KeyedMutator<{
  apiKeys: T[]
  scopes: Record<string, string[]>
}>

type APIKeyDetailsProps = {
  modalState: [boolean, (open: boolean) => void]
  editingKey: EditableKey
  gameScopes: Record<string, string[]>
  adminApiKeyScopes: Record<string, string[]>
  mutateGame: KeysMutator<APIKey>
  mutateAdmin: KeysMutator<AdminApiKey>
}

export function APIKeyDetails({
  modalState,
  editingKey,
  gameScopes,
  adminApiKeyScopes,
  mutateGame,
  mutateAdmin,
}: APIKeyDetailsProps) {
  const [, setOpen] = modalState

  const toast = useContext(ToastContext)

  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame
  const user = useAtomValue(userState) as AuthedUser

  const initialType: KeyType = editingKey?.type ?? 'game'
  const [activeType, setActiveType] = useState<KeyType>(initialType)

  useEffect(() => {
    setActiveType(editingKey?.type ?? 'game')
  }, [editingKey])

  const activeScopes = activeType === 'game' ? gameScopes : adminApiKeyScopes

  const [selectedScopes, setSelectedScopes] = useState(editingKey ? editingKey.key.scopes : [])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<TaloError | null>(null)
  const [createdToken, setCreatedToken] = useState<string | null>(null)

  const expandWildcard = (scopes: string[]) => {
    return scopes.includes('*') ? Object.values(activeScopes).flat() : scopes
  }

  const onScopeChecked = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedScopes([...selectedScopes, e.target.value])
    } else {
      setSelectedScopes(expandWildcard(selectedScopes).filter((s) => s !== e.target.value))
    }
  }

  const onAllScopesSelected = () => {
    const allScopes = Object.values(activeScopes).flat()
    setSelectedScopes(allScopes)
  }

  const onNoScopesSelected = () => {
    setSelectedScopes([])
  }

  const onGroupChecked = (group: string) => (checked: boolean) => {
    const groupScopes = activeScopes[group]
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
      if (activeType === 'game') {
        const { token, apiKey } = await createAPIKey(activeGame.id, selectedScopes)
        setCreatedToken(token)
        await mutateGame((data) => {
          if (!data) {
            throw new Error('API key data is not set')
          }
          return {
            ...data,
            apiKeys: [...data.apiKeys, apiKey],
          }
        })
      } else {
        const { key, apiKey } = await createAdminApiKey(activeGame.id, selectedScopes)
        setCreatedToken(key)
        await mutateAdmin((data) => {
          if (!data) {
            throw new Error('Admin API key data is not set')
          }
          return {
            ...data,
            apiKeys: [...data.apiKeys, apiKey],
          }
        })
      }
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  const onUpdateClick = async () => {
    if (!editingKey) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (editingKey.type === 'game') {
        const { apiKey } = await updateAPIKey(activeGame.id, editingKey.key.id, {
          scopes: selectedScopes,
        })

        await mutateGame((data) => {
          if (!data) {
            throw new Error('API key data is not set')
          }
          return {
            ...data,
            apiKeys: data.apiKeys.map((k) => (k.id === editingKey.key.id ? apiKey : k)),
          }
        })
        toast.trigger('API key scopes updated', ToastType.SUCCESS)
      } else {
        const { apiKey } = await updateAdminApiKey(activeGame.id, editingKey.key.id, {
          scopes: selectedScopes,
        })

        await mutateAdmin((data) => {
          if (!data) {
            throw new Error('Admin API key data is not set')
          }
          return {
            ...data,
            apiKeys: data.apiKeys.map((k) => (k.id === editingKey.key.id ? apiKey : k)),
          }
        })
        toast.trigger('Admin API key scopes updated', ToastType.SUCCESS)
      }
      setOpen(false)
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  const isEdit = editingKey !== null
  const isAdmin = activeType === 'admin'

  const title = isEdit ? (isAdmin ? 'Update admin API key' : 'Update API key') : 'Create API key'

  const createdCopyMessage = isAdmin
    ? 'Admin API key copied to clipboard'
    : 'API key copied to clipboard'

  return (
    <Modal
      id='api-key-details'
      title={title}
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
                    toast.trigger(createdCopyMessage)
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
                  disabled={!user.emailConfirmed || (!isEdit && selectedScopes.length === 0)}
                  isLoading={isLoading}
                  onClick={isEdit ? onUpdateClick : onCreateClick}
                >
                  {isEdit ? 'Update' : 'Create'}
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
            {!isEdit && (
              <div className='-mt-2 text-sm'>
                {activeType === 'game' ? (
                  <>These keys can be used directly inside your game client</>
                ) : (
                  <>
                    These keys should be used inside a secure environment (like a game server)
                    <AlertBanner
                      className='mt-2 text-base text-white'
                      text='You should never use this key inside a game client'
                    ></AlertBanner>
                  </>
                )}
              </div>
            )}

            <div className='mb-2!'>
              <h3 className='font-semibold'>Scopes</h3>
              <p className='text-sm'>Scopes control what your API key can do</p>
            </div>
            <div className='grid max-h-80 grid-cols-1 gap-4 overflow-y-auto rounded border border-gray-200 p-4 md:grid-cols-2'>
              {activeScopes &&
                Object.keys(activeScopes)
                  .sort((a, b) => {
                    if (a === 'players') return -1
                    if (b === 'players') return 1
                    return a.localeCompare(b)
                  })
                  .map((group) => {
                    const allSelected =
                      selectedScopes.includes('*') ||
                      activeScopes[group].every((s) => selectedScopes.includes(s))
                    const selectedCount = activeScopes[group].filter((s) =>
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
                          {activeScopes[group].map((scope: string) => (
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
