import { format } from 'date-fns'
import { ChangeEvent, MouseEvent, useContext, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import createAPIKey from '../api/createAPIKey'
import deleteAPIKey from '../api/deleteAPIKey'
import useAPIKeys from '../api/useAPIKeys'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import ToastContext from '../components/toast/ToastContext'
import { APIKey } from '../entities/apiKey'
import Scopes from '../modals/Scopes'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState, { AuthedUser } from '../state/userState'
import buildError from '../utils/buildError'
import { formatAPIKeyScopeGroup } from '../utils/formatAPIKeyScopeGroup'

export default function APIKeys() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const {
    apiKeys,
    scopes: availableScopes,
    loading,
    error: fetchError,
    mutate,
  } = useAPIKeys(activeGame)

  const [deletingKeys, setDeletingKeys] = useState<number[]>([])
  const [error, setError] = useState<TaloError | null>(null)

  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const [isCreating, setCreating] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const user = useRecoilValue(userState) as AuthedUser
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null)
  const [showScopesModal, setShowScopesModal] = useState(false)

  const toast = useContext(ToastContext)

  useEffect(() => {
    setShowScopesModal(Boolean(selectedKey))
  }, [selectedKey])

  useEffect(() => {
    if (!showScopesModal) setSelectedKey(null)
  }, [showScopesModal])

  const onDeleteClick = async (apiKey: APIKey) => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete this access key? This action is irreversible.',
      )
    ) {
      setError(null)
      setDeletingKeys([...deletingKeys, apiKey.id])

      try {
        await deleteAPIKey(activeGame.id, apiKey.id)
        await mutate((data) => {
          if (!data) {
            throw new Error('API key data not set')
          }

          return {
            ...data,
            apiKeys: data.apiKeys.filter((k) => k.id !== apiKey.id),
          }
        })

        setError(null)
        setCreatedKey(null)
        toast.trigger('Access key revoked')
      } catch (err) {
        setError(buildError(err))
      } finally {
        setDeletingKeys(deletingKeys.filter((k) => k !== apiKey.id))
      }
    }
  }

  const onCreateClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setError(null)
    setCreating(true)

    try {
      const { apiKey, token } = await createAPIKey(activeGame.id, selectedScopes)
      await mutate((data) => {
        if (!data) {
          throw new Error('API key data not set')
        }

        return {
          ...data,
          apiKeys: [...data.apiKeys, apiKey],
        }
      })

      setCreatedKey(token)
      setSelectedScopes([])
    } catch (err) {
      setError(buildError(err))
      window.scrollTo(0, 0)
    } finally {
      setCreating(false)
    }
  }

  const onScopeChecked = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedScopes([...selectedScopes, e.target.value])
    } else {
      setSelectedScopes(selectedScopes.filter((s) => s !== e.target.value))
    }
  }

  return (
    <>
      <Page title='Access keys' isLoading={loading}>
        {Boolean(error ?? fetchError) && <ErrorMessage error={error ?? fetchError} />}

        {!user.emailConfirmed && (
          <AlertBanner
            className='lg:w-max'
            text='You need to confirm your email address to manage access keys'
          />
        )}

        {user.emailConfirmed && apiKeys.length > 0 && (
          <Table columns={['Created by', 'Created at', 'Last used', 'Scopes', '']}>
            <TableBody iterator={apiKeys}>
              {(key) => (
                <>
                  <TableCell>{key.createdBy === user.username ? 'You' : key.createdBy}</TableCell>
                  <DateCell>{format(new Date(key.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                  <DateCell>
                    {key.lastUsedAt
                      ? format(new Date(key.lastUsedAt), 'dd MMM yyyy, HH:mm')
                      : 'Never used'}
                  </DateCell>
                  <TableCell className='flex'>
                    <div>
                      <Button variant='grey' onClick={() => setSelectedKey(key)}>
                        Modify scopes
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className='w-40'>
                    <Button variant='black' onClick={() => onDeleteClick(key)}>
                      Revoke
                    </Button>
                  </TableCell>
                </>
              )}
            </TableBody>
          </Table>
        )}

        {apiKeys.length > 0 && <div className='h-1 rounded bg-gray-700' />}

        {!createdKey && (
          <form className='lg:2/3 w-full xl:w-1/2'>
            <h2 className='text-xl font-bold lg:text-2xl'>Create key</h2>

            <div className='mt-4 rounded border-2 border-gray-700'>
              <div className='bg-gray-700 p-4'>
                <h3 className='text-lg font-bold'>Scopes</h3>
                <p>Scopes control what your access key can and can&apos;t do</p>
              </div>

              <div className='grid grid-cols-1 gap-x-8 gap-y-4 p-4 md:grid-cols-2 md:gap-y-8'>
                {availableScopes &&
                  Object.keys(availableScopes).map((group) => (
                    <div key={group}>
                      <h4 className='font-semibold'>{formatAPIKeyScopeGroup(group)}</h4>
                      {availableScopes[group].map((scope: string) => (
                        <div key={scope}>
                          <input
                            id={scope}
                            type='checkbox'
                            disabled={!user.emailConfirmed}
                            onChange={onScopeChecked}
                            checked={Boolean(selectedScopes.find((s) => s === scope))}
                            value={scope}
                          />
                          <label htmlFor={scope} className='ml-2'>
                            {scope}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>

              {!loading && !availableScopes && (
                <ErrorMessage className='mt-4' error={{ message: "Couldn't fetch scopes" }} />
              )}
            </div>

            <Button
              isLoading={isCreating}
              variant='green'
              className='mt-4'
              onClick={onCreateClick}
              disabled={!user.emailConfirmed}
            >
              Create
            </Button>
          </form>
        )}

        {createdKey && (
          <div className='lg:2/3 w-full xl:w-1/2'>
            <h2 className='text-xl font-bold lg:text-2xl'>Your new key</h2>
            <p>Save this key somewhere because we won&apos;t show it again</p>

            <div className='mt-4 rounded border-2 border-gray-700 bg-gray-700 p-4 wrap-break-word'>
              <code>{createdKey}</code>
            </div>

            <Button className='mt-4' onClick={() => setCreatedKey(null)}>
              Create another
            </Button>
          </div>
        )}
      </Page>

      {showScopesModal && (
        <Scopes
          modalState={[showScopesModal, setShowScopesModal]}
          selectedKey={selectedKey}
          availableScopes={availableScopes}
          mutate={mutate}
        />
      )}
    </>
  )
}
