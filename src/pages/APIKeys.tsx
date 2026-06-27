import { IconPlus } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import deleteAPIKey from '../api/deleteAPIKey'
import useAPIKeys from '../api/useAPIKeys'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import { NoAPIKeys } from '../components/empty-states/NoAPIKeys'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import ToastContext from '../components/toast/ToastContext'
import { APIKey } from '../entities/apiKey'
import APIKeyDetails from '../modals/APIKeyDetails'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState, { AuthedUser } from '../state/userState'
import buildError from '../utils/buildError'

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
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingKey, setEditingKey] = useState<APIKey | null>(null)

  const user = useRecoilValue(userState) as AuthedUser
  const toast = useContext(ToastContext)

  useEffect(() => {
    if (!showDetailsModal) setEditingKey(null)
  }, [showDetailsModal])

  const onDeleteClick = async (apiKey: APIKey) => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this access key? This action is irreversible.',
      )
    ) {
      return
    }

    setError(null)
    setDeletingKeys((keys) => [...keys, apiKey.id])

    try {
      await deleteAPIKey(activeGame.id, apiKey.id)
      await mutate((data) => {
        if (!data) {
          throw new Error('API key data not set')
        }

        return {
          ...data,
          apiKeys: data.apiKeys.filter((k: APIKey) => k.id !== apiKey.id),
        }
      })

      toast.trigger('Access key revoked')
    } catch (err) {
      setError(buildError(err))
    } finally {
      setDeletingKeys((keys) => keys.filter((k) => k !== apiKey.id))
    }
  }

  return (
    <Page
      title='Access keys'
      isLoading={loading}
      extraTitleComponent={
        <div className='mt-1 ml-4 rounded-full bg-indigo-600 p-1'>
          <Button
            variant='icon'
            onClick={() => {
              setEditingKey(null)
              setShowDetailsModal(true)
            }}
            icon={<IconPlus />}
            extra={{ 'aria-label': 'Create access key' }}
          />
        </div>
      }
    >
      {Boolean(error ?? fetchError) && <ErrorMessage error={error ?? fetchError} />}

      {!user.emailConfirmed && (
        <AlertBanner
          className='lg:w-max'
          text='You need to confirm your email address to manage access keys'
        />
      )}

      {!error && !loading && apiKeys.length === 0 && <NoAPIKeys />}

      {!error && apiKeys.length > 0 && (
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
                    <Button
                      variant='grey'
                      onClick={() => {
                        setEditingKey(key)
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

      {showDetailsModal && (
        <APIKeyDetails
          modalState={[showDetailsModal, setShowDetailsModal]}
          editingKey={editingKey}
          availableScopes={availableScopes}
          mutate={mutate}
        />
      )}
    </Page>
  )
}
