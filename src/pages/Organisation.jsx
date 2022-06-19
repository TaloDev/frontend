import React, { useState } from 'react'
import { format } from 'date-fns'
import { useRecoilValue } from 'recoil'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import organisationState from '../state/organisationState'
import useOrganisation from '../api/useOrganisation'
import userTypes, { userTypeMap } from '../constants/userTypes'
import Button from '../components/Button'
import { IconPlus } from '@tabler/icons'
import ErrorMessage from '../components/ErrorMessage'
import NewInvite from '../modals/NewInvite'
import SecondaryNav from '../components/SecondaryNav'
import { secondaryNavRoutes } from './Dashboard'
import Table from '../components/tables/Table'
import AlertBanner from '../components/AlertBanner'
import userState from '../state/userState'
import SecondaryTitle from '../components/SecondaryTitle'

function Organisation() {
  const organisation = useRecoilValue(organisationState)
  const { games, members, pendingInvites, loading, error, mutate } = useOrganisation()
  const [showModal, setShowModal] = useState(false)
  const user = useRecoilValue(userState)

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

              <Table columns={['Game', 'Player count', 'Created at']}>
                <TableBody iterator={games}>
                  {(game) => (
                    <>
                      <TableCell>{game.name}</TableCell>
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
                      <TableCell>{invite.type === userTypes.ADMIN ? 'Admin' : 'Dev'}</TableCell>
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
              className='w-auto'
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
