import React, { useState } from 'react'
import { format } from 'date-fns'
import { useRecoilValue } from 'recoil'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import TableHeader from '../components/tables/TableHeader'
import organisationState from '../state/organisationState'
import useOrganisation from '../api/useOrganisation'
import userTypes from '../constants/userTypes'
import Button from '../components/Button'
import { IconPlus } from '@tabler/icons'
import ErrorMessage from '../components/ErrorMessage'
import NewInvite from '../modals/NewInvite'
import SecondaryNav from '../components/SecondaryNav'
import { secondaryNavRoutes } from './Dashboard'

function Organisation() {
  const organisation = useRecoilValue(organisationState)
  const { games, members, pendingInvites, loading, error, mutate } = useOrganisation()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <SecondaryNav routes={secondaryNavRoutes} />
      <Page title={organisation.name} isLoading={loading}>
        {!loading && !error &&
          <>
            {games.length > 0 &&
              <>
                <h2 className='text-2xl'>Games</h2>

                <div className='overflow-x-scroll'>
                  <table className='table-auto w-full'>
                    <TableHeader columns={['Game', 'Player count', 'Created at']} />
                    <TableBody iterator={games}>
                      {(game) => (
                        <>
                          <TableCell>{game.name}</TableCell>
                          <TableCell>{game.playerCount}</TableCell>
                          <DateCell>{format(new Date(game.createdAt), 'do MMM Y')}</DateCell>
                        </>
                      )}
                    </TableBody>
                  </table>
                </div>
              </>
            }

            <h2 className='text-2xl'>Pending invites</h2>

            <div className='space-y-4'>
              {pendingInvites.length > 0 &&
                <div className='overflow-x-scroll'>
                  <table className='table-auto w-full'>
                    <TableHeader columns={['Email', 'Type', 'Sent at']} />
                    <TableBody iterator={pendingInvites}>
                      {(invite) => (
                        <>
                          <TableCell>{invite.email}</TableCell>
                          <TableCell>{invite.type === userTypes.ADMIN ? 'Admin' : 'Dev'}</TableCell>
                          <DateCell>{format(new Date(invite.createdAt), 'do MMM Y')}</DateCell>
                        </>
                      )}
                    </TableBody>
                  </table>
                </div>
              }

              {pendingInvites.length === 0 && <p>There are currently no pending invitations</p>}

              <Button
                className='w-auto'
                onClick={() => setShowModal(true)}
                icon={<IconPlus />}
              >
                <span>Invite member</span>
              </Button>
            </div>

            <h2 className='text-2xl'>Members</h2>

            <div className='overflow-x-scroll'>
              <table className='table-auto w-full'>
                <TableHeader columns={['Email', 'Username', 'Type', 'Joined', 'Last seen']} />
                <TableBody iterator={members}>
                  {(member) => (
                    <>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.username}</TableCell>
                      <TableCell>{member.type === userTypes.ADMIN ? 'Admin' : 'Dev'}</TableCell>
                      <DateCell>{format(new Date(member.createdAt), 'do MMM Y')}</DateCell>
                      <DateCell>{format(new Date(member.lastSeenAt), 'do MMM Y')}</DateCell>
                    </>
                  )}
                </TableBody>
              </table>
            </div>
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
    </>
  )
}

export default Organisation
