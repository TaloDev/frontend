import { IconPlus } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { useAdminApiKeys } from '../api/useAdminApiKeys'
import { useAPIKeys } from '../api/useAPIKeys'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import { NoAPIKeys } from '../components/empty-states/NoAPIKeys'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import SecondaryTitle from '../components/SecondaryTitle'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import { APIKeyDetails, type EditableKey } from '../modals/APIKeyDetails'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'
import { userState, AuthedUser } from '../state/userState'

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

  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingKey, setEditingKey] = useState<EditableKey>(null)

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
      {Boolean(fetchError) && <ErrorMessage error={fetchError} />}
      {Boolean(adminFetchError) && <ErrorMessage error={adminFetchError} />}

      {!user.emailConfirmed && (
        <AlertBanner
          className='lg:w-max'
          text='You need to confirm your email address to manage API keys'
        />
      )}

      {!fetchError &&
        !adminFetchError &&
        !loading &&
        !adminLoading &&
        apiKeys.length === 0 &&
        adminApiKeys.length === 0 && <NoAPIKeys />}

      {apiKeys.length > 0 && <SecondaryTitle>Game API keys</SecondaryTitle>}

      {!fetchError && apiKeys.length > 0 && (
        <Table columns={['Name', 'Token', 'Created by', 'Created at', 'Last used', '']}>
          <TableBody iterator={apiKeys}>
            {(key) => (
              <>
                <TableCell>{key.name || '—'}</TableCell>
                <TableCell className='font-mono'>ey...{key.keyEnding}</TableCell>
                <TableCell>{key.createdBy === user.username ? 'You' : key.createdBy}</TableCell>
                <DateCell>{format(new Date(key.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                <DateCell>
                  {key.lastUsedAt
                    ? format(new Date(key.lastUsedAt), 'dd MMM yyyy, HH:mm')
                    : 'Never used'}
                </DateCell>
                <TableCell className='w-40'>
                  <Button
                    variant='grey'
                    onClick={() => {
                      setEditingKey({ type: 'game', key })
                      setShowDetailsModal(true)
                    }}
                  >
                    Modify
                  </Button>
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      )}

      {adminApiKeys.length > 0 && <SecondaryTitle>Admin API keys</SecondaryTitle>}

      {!adminFetchError && adminApiKeys.length > 0 && (
        <Table columns={['Name', 'Token', 'Created by', 'Created at', 'Last used', '']}>
          <TableBody iterator={adminApiKeys}>
            {(key) => (
              <>
                <TableCell>{key.name || '—'}</TableCell>
                <TableCell className='font-mono'>ta...{key.keyEnding}</TableCell>
                <TableCell>{key.createdBy === user.username ? 'You' : key.createdBy}</TableCell>
                <DateCell>{format(new Date(key.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                <DateCell>
                  {key.lastUsedAt
                    ? format(new Date(key.lastUsedAt), 'dd MMM yyyy, HH:mm')
                    : 'Never used'}
                </DateCell>
                <TableCell className='w-40'>
                  <Button
                    variant='grey'
                    onClick={() => {
                      setEditingKey({ type: 'admin', key })
                      setShowDetailsModal(true)
                    }}
                  >
                    Modify
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
