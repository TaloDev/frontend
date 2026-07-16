import { IconPlus } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useAtomValue } from 'jotai'
import { useContext, useEffect, useState } from 'react'
import { deleteAdminApiKey } from '../api/deleteAdminApiKey'
import { deleteAPIKey } from '../api/deleteAPIKey'
import { useAdminApiKeys } from '../api/useAdminApiKeys'
import { useAPIKeys } from '../api/useAPIKeys'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import { NoAPIKeys } from '../components/empty-states/NoAPIKeys'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Page from '../components/Page'
import SecondaryTitle from '../components/SecondaryTitle'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import ToastContext from '../components/toast/ToastContext'
import { AdminApiKey } from '../entities/adminApiKey'
import { APIKey } from '../entities/apiKey'
import { APIKeyDetails, type EditableKey } from '../modals/APIKeyDetails'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'
import { userState, AuthedUser } from '../state/userState'
import buildError from '../utils/buildError'

export default function APIKeys() {
  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame
  const user = useAtomValue(userState) as AuthedUser

  const {
    apiKeys,
    scopes: gameScopes,
    loading,
    error: fetchError,
    mutate: gameMutate,
  } = useAPIKeys(activeGame)

  const {
    apiKeys: adminApiKeys,
    scopes: adminApiKeyScopes,
    loading: adminLoading,
    error: adminFetchError,
    mutate: adminMutate,
  } = useAdminApiKeys(activeGame)

  const [deletingKeys, setDeletingKeys] = useState<number[]>([])
  const [deletingAdminKeys, setDeletingAdminKeys] = useState<number[]>([])
  const [error, setError] = useState<TaloError | null>(null)
  const [adminError, setAdminError] = useState<TaloError | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingKey, setEditingKey] = useState<EditableKey>(null)

  const toast = useContext(ToastContext)

  useEffect(() => {
    if (!showDetailsModal) setEditingKey(null)
  }, [showDetailsModal])

  const onDeleteClick = async (apiKey: APIKey) => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this API key? This action is irreversible.',
      )
    ) {
      return
    }

    setError(null)
    setDeletingKeys((keys) => [...keys, apiKey.id])

    try {
      await deleteAPIKey(activeGame.id, apiKey.id)
      await gameMutate((data) => {
        if (!data) {
          throw new Error('API key data not set')
        }

        return {
          ...data,
          apiKeys: data.apiKeys.filter((k: APIKey) => k.id !== apiKey.id),
        }
      })

      toast.trigger('API key revoked')
    } catch (err) {
      setError(buildError(err))
    } finally {
      setDeletingKeys((keys) => keys.filter((k) => k !== apiKey.id))
    }
  }

  const onDeleteAdminApiKeyClick = async (adminApiKey: AdminApiKey) => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this admin API key? This action is irreversible.',
      )
    ) {
      return
    }

    setAdminError(null)
    setDeletingAdminKeys((keys) => [...keys, adminApiKey.id])

    try {
      await deleteAdminApiKey(activeGame.id, adminApiKey.id)
      await adminMutate((data) => {
        if (!data) {
          throw new Error('Admin API key data not set')
        }

        return {
          ...data,
          apiKeys: data.apiKeys.filter((k: AdminApiKey) => k.id !== adminApiKey.id),
        }
      })

      toast.trigger('Admin API key revoked')
    } catch (err) {
      setAdminError(buildError(err))
    } finally {
      setDeletingAdminKeys((keys) => keys.filter((k) => k !== adminApiKey.id))
    }
  }

  return (
    <Page
      title='API keys'
      isLoading={loading || adminLoading}
      extraTitleComponent={
        <div className='mt-1 ml-4 rounded-full bg-indigo-600 p-1'>
          <Button
            variant='icon'
            onClick={() => {
              setEditingKey(null)
              setShowDetailsModal(true)
            }}
            icon={<IconPlus />}
            extra={{ 'aria-label': 'Create API key' }}
          />
        </div>
      }
    >
      {Boolean(error ?? fetchError) && <ErrorMessage error={error ?? fetchError} />}
      {Boolean(adminError ?? adminFetchError) && (
        <ErrorMessage error={adminError ?? adminFetchError} />
      )}

      {!user.emailConfirmed && (
        <AlertBanner
          className='lg:w-max'
          text='You need to confirm your email address to manage API keys'
        />
      )}

      {!error &&
        !adminError &&
        !loading &&
        !adminLoading &&
        apiKeys.length === 0 &&
        adminApiKeys.length === 0 && <NoAPIKeys />}

      {apiKeys.length > 0 && <SecondaryTitle>Game API keys</SecondaryTitle>}

      {!error && apiKeys.length > 0 && (
        <Table columns={['Token', 'Created by', 'Created at', 'Last used', 'Scopes', '']}>
          <TableBody iterator={apiKeys}>
            {(key) => (
              <>
                <TableCell className='font-mono'>ey...{key.keyEnding}</TableCell>
                <TableCell>{key.createdBy === user.username ? 'You' : key.createdBy}</TableCell>
                <DateCell>{format(new Date(key.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                <DateCell>
                  {key.lastUsedAt
                    ? format(new Date(key.lastUsedAt), 'dd MMM yyyy, HH:mm')
                    : 'Never used'}
                </DateCell>
                <TableCell className='flex'>
                  <div>
                    <Button
                      variant='grey'
                      onClick={() => {
                        setEditingKey({ type: 'game', key })
                        setShowDetailsModal(true)
                      }}
                    >
                      Modify scopes
                    </Button>
                  </div>
                </TableCell>
                <TableCell className='w-40'>
                  <Button
                    variant='black'
                    isLoading={deletingKeys.includes(key.id)}
                    disabled={deletingKeys.includes(key.id) || !user.emailConfirmed}
                    onClick={() => onDeleteClick(key)}
                  >
                    Revoke
                  </Button>
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      )}

      {adminApiKeys.length > 0 && <SecondaryTitle>Admin API keys</SecondaryTitle>}

      {!adminError && adminApiKeys.length > 0 && (
        <Table columns={['Token', 'Created by', 'Created at', 'Last used', 'Scopes', '']}>
          <TableBody iterator={adminApiKeys}>
            {(key) => (
              <>
                <TableCell className='font-mono'>ta...{key.keyEnding}</TableCell>
                <TableCell>{key.createdBy === user.username ? 'You' : key.createdBy}</TableCell>
                <DateCell>{format(new Date(key.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                <DateCell>
                  {key.lastUsedAt
                    ? format(new Date(key.lastUsedAt), 'dd MMM yyyy, HH:mm')
                    : 'Never used'}
                </DateCell>
                <TableCell className='flex'>
                  <div>
                    <Button
                      variant='grey'
                      onClick={() => {
                        setEditingKey({ type: 'admin', key })
                        setShowDetailsModal(true)
                      }}
                    >
                      Modify scopes
                    </Button>
                  </div>
                </TableCell>
                <TableCell className='w-40'>
                  <Button
                    variant='black'
                    isLoading={deletingAdminKeys.includes(key.id)}
                    disabled={deletingAdminKeys.includes(key.id) || !user.emailConfirmed}
                    onClick={() => onDeleteAdminApiKeyClick(key)}
                  >
                    Revoke
                  </Button>
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      )}

      {showDetailsModal && (
        <APIKeyDetails
          modalState={[showDetailsModal, setShowDetailsModal]}
          editingKey={editingKey}
          gameScopes={gameScopes}
          adminApiKeyScopes={adminApiKeyScopes}
          mutateGame={gameMutate}
          mutateAdmin={adminMutate}
        />
      )}
    </Page>
  )
}
