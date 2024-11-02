import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useRecoilValue } from 'recoil'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import organisationState from '../state/organisationState'
import useOrganisation from '../api/useOrganisation'
import Button from '../components/Button'
import { IconCheck, IconPencil, IconPlus, IconX } from '@tabler/icons-react'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import NewInvite from '../modals/NewInvite'
import SecondaryNav from '../components/SecondaryNav'
import { secondaryNavRoutes } from './Dashboard'
import Table from '../components/tables/Table'
import AlertBanner from '../components/AlertBanner'
import userState, { AuthedUser } from '../state/userState'
import SecondaryTitle from '../components/SecondaryTitle'
import { UserType } from '../entities/user'
import userTypeMap from '../constants/userTypeMap'
import TextInput from '../components/TextInput'
import updateGame from '../api/updateGame'
import buildError from '../utils/buildError'

function Organisation() {
  const organisation = useRecoilValue(organisationState)
  const { games, members, pendingInvites, loading, error, mutate } = useOrganisation()
  const [showModal, setShowModal] = useState(false)
  const user = useRecoilValue(userState) as AuthedUser

  const [editingGameId, setEditingGameId] = useState<number | null>(null)
  const [editingGameName, setEditingGameName] = useState('')
  const [editingGameNameError, setEditingGameNameError] = useState<TaloError | null>(null)

  useEffect(() => {
    if (editingGameId) {
      setEditingGameName(games.find((game) => game.id === editingGameId)!.name)
    } else {
      setEditingGameName('')
    }

    setEditingGameNameError(null)
  }, [editingGameId, games])

  const onUpdateGameName = useCallback(async () => {
    try {
      const { game } = await updateGame(editingGameId!, { name: editingGameName })

      mutate((data) => {
        return {
          ...data!,
          games: data!.games.map((existingGame) => {
            if (existingGame.id === editingGameId) return { ...existingGame, name: game.name }
            return existingGame
          })
        }
      }, false)

      setEditingGameId(null)
    } catch (err) {
      setEditingGameNameError(buildError(err))
    }
  }, [editingGameId, editingGameName, mutate])

  return (
    <Page
      title={organisation.name}
      isLoading={loading}
      secondaryNav={<SecondaryNav routes={secondaryNavRoutes} />}
    >
      {!loading && !error &&
        <>
          {games.length > 0 &&
            <>
              <SecondaryTitle>Games</SecondaryTitle>

              {editingGameNameError && <ErrorMessage error={editingGameNameError} />}

              <Table columns={['Game', 'Player count', 'Created at']}>
                <TableBody iterator={games}>
                  {(game) => (
                    <>
                      <TableCell className='flex items-center space-x-2'>
                        {editingGameId === game.id &&
                          <>
                            <TextInput
                              id={`edit-name-${game.id}`}
                              variant='light'
                              placeholder='Name'
                              onChange={setEditingGameName}
                              value={editingGameName}
                            />
                            <Button
                              variant='icon'
                              className='p-1 rounded-full bg-indigo-900'
                              onClick={onUpdateGameName}
                              icon={<IconCheck size={16} />}
                              extra={{ 'aria-label': 'Update game name' }}
                            />
                            <Button
                              variant='icon'
                              className='p-1 rounded-full bg-indigo-900'
                              onClick={() => setEditingGameId(null)}
                              icon={<IconX size={16} />}
                              extra={{ 'aria-label': 'Cancel editing game name' }}
                            />
                          </>
                        }
                        {editingGameId !== game.id &&
                          <>
                            <span>{game.name}</span>
                            <Button
                              variant='icon'
                              className='p-1 rounded-full bg-indigo-900'
                              onClick={() => setEditingGameId(game.id)}
                              icon={<IconPencil size={16} />}
                              extra={{ 'aria-label': 'Edit game name' }}
                            />
                          </>
                        }
                      </TableCell>
                      <TableCell>{game.playerCount}</TableCell>
                      <DateCell>{format(new Date(game.createdAt), 'do MMM Y')}</DateCell>
                    </>
                  )}
                </TableBody>
              </Table>
            </>
          }

          <SecondaryTitle>Pending invites</SecondaryTitle>

          {!user.emailConfirmed &&
            <AlertBanner className='lg:w-max' text='You need to confirm your email address to invite users' />
          }

          <div className='space-y-4'>
            {pendingInvites.length > 0 &&
              <Table columns={['Email', 'Type', 'Invited by', 'Sent at']}>
                <TableBody iterator={pendingInvites}>
                  {(invite) => (
                    <>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>{invite.type === UserType.ADMIN ? 'Admin' : 'Dev'}</TableCell>
                      <TableCell>{invite.invitedBy}</TableCell>
                      <DateCell>{format(new Date(invite.createdAt), 'do MMM Y')}</DateCell>
                    </>
                  )}
                </TableBody>
              </Table>
            }

            {pendingInvites.length === 0 && user.emailConfirmed &&
              <p>There are currently no pending invitations</p>
            }

            <Button
              className='w-full md:w-auto'
              onClick={() => setShowModal(true)}
              icon={<IconPlus />}
              disabled={!user.emailConfirmed}
            >
              <span>Invite member</span>
            </Button>
          </div>

          <SecondaryTitle>Members</SecondaryTitle>

          <Table columns={['Username', 'Type', 'Joined', 'Last seen']}>
            <TableBody iterator={members}>
              {(member) => (
                <>
                  <TableCell>{member.username}</TableCell>
                  <TableCell>{userTypeMap[member.type]}</TableCell>
                  <DateCell>{format(new Date(member.createdAt), 'do MMM Y')}</DateCell>
                  <DateCell>{format(new Date(member.lastSeenAt), 'do MMM Y')}</DateCell>
                </>
              )}
            </TableBody>
          </Table>
        </>
      }

      {showModal &&
        <NewInvite
          modalState={[showModal, setShowModal]}
          mutate={mutate}
        />
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}

export default Organisation
