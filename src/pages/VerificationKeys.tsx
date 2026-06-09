import { IconEye, IconEyeOff, IconPlus } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useContext, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { deleteVerificationKey } from '../api/deleteVerificationKey'
import { useVerificationKeys } from '../api/useVerificationKeys'
import Button from '../components/Button'
import { NoVerificationKeys } from '../components/empty-states/NoVerificationKeys'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import ToastContext from '../components/toast/ToastContext'
import CreateVerificationKey from '../modals/CreateVerificationKey'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import buildError from '../utils/buildError'

export default function VerificationKeys() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const { verificationKeys, loading, error: fetchError, mutate } = useVerificationKeys(activeGame)
  const toast = useContext(ToastContext)

  const [deletingKeys, setDeletingKeys] = useState<number[]>([])
  const [error, setError] = useState<TaloError | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<number[]>([])

  const onDeleteClick = async (id: number) => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete this verification key? This action is irreversible.',
      )
    ) {
      setError(null)
      setDeletingKeys((prev) => [...prev, id])

      try {
        await deleteVerificationKey(activeGame.id, id)
        await mutate((data) => {
          if (!data) throw new Error('Verification key data not set')

          return {
            ...data,
            verificationKeys: data.verificationKeys.filter((k) => k.id !== id),
          }
        })

        setError(null)
        toast.trigger('Verification key deleted')
      } catch (err) {
        setError(buildError(err))
      } finally {
        setDeletingKeys((prev) => prev.filter((k) => k !== id))
      }
    }
  }

  return (
    <>
      <Page
        showBackButton
        title='Verification keys'
        isLoading={loading}
        extraTitleComponent={
          <div className='mt-1 ml-4 rounded-full bg-indigo-600 p-1'>
            <Button
              variant='icon'
              onClick={() => setShowCreateModal(true)}
              icon={<IconPlus />}
              extra={{ 'aria-label': 'Create verification key' }}
            />
          </div>
        }
      >
        {Boolean(error ?? fetchError) && <ErrorMessage error={error ?? fetchError} />}

        {!error && !fetchError && !loading && verificationKeys.length === 0 && (
          <NoVerificationKeys />
        )}

        {verificationKeys.length > 0 && (
          <Table columns={['Version', 'Value', 'Created at', '']}>
            <TableBody iterator={verificationKeys}>
              {(key) => {
                const isVisible = visibleKeys.includes(key.id)

                return (
                  <>
                    <TableCell>{key.version}</TableCell>
                    <TableCell className='w-160'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='icon'
                          className='ml-2 rounded-full bg-indigo-900 p-1'
                          onClick={() => {
                            setVisibleKeys((prev) =>
                              isVisible ? prev.filter((id) => id !== key.id) : [...prev, key.id],
                            )
                          }}
                          aria-label={isVisible ? 'Hide value' : 'Show value'}
                        >
                          {isVisible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                        </Button>
                        {isVisible ? (
                          key.value
                        ) : (
                          <span className='tracking-wider'>
                            &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <DateCell>{format(new Date(key.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                    <TableCell className='w-40'>
                      <Button
                        variant='grey'
                        disabled={deletingKeys.includes(key.id)}
                        onClick={() => onDeleteClick(key.id)}
                      >
                        {deletingKeys.includes(key.id) ? 'Deleting...' : 'Delete'}
                      </Button>
                    </TableCell>
                  </>
                )
              }}
            </TableBody>
          </Table>
        )}
      </Page>

      {showCreateModal && (
        <CreateVerificationKey modalState={[showCreateModal, setShowCreateModal]} mutate={mutate} />
      )}
    </>
  )
}
