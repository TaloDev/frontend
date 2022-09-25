import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import activeGameState from '../state/activeGameState'
import ErrorMessage from '../components/ErrorMessage'
import { format } from 'date-fns'
import { IconPlus } from '@tabler/icons'
import Button from '../components/Button'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import DateCell from '../components/tables/cells/DateCell'
import Page from '../components/Page'
import Table from '../components/tables/Table'
import useGroups from '../api/useGroups'
import GroupDetails from '../modals/groups/GroupDetails'
import useSortedItems from '../utils/useSortedItems'

export default function Groups() {
  const activeGame = useRecoilValue(activeGameState)

  const [showModal, setShowModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)

  const { groups, loading, error, mutate } = useGroups(activeGame)
  const sortedGroups = useSortedItems(groups, 'name', 'asc')

  useEffect(() => {
    if (!showModal) setEditingGroup(null)
  }, [showModal, editingGroup])

  const onEditGroupClick = (group) => {
    setEditingGroup(group)
    setShowModal(true)
  }

  return (
    <Page
      title='Groups'
      isLoading={loading}
      extraTitleComponent={
        <div className='mt-1 ml-4 p-1 rounded-full bg-indigo-600'>
          <Button
            variant='icon'
            onClick={() => setShowModal(true)}
            icon={<IconPlus />}
            extra={{ 'aria-label': 'Create group' }}
          />
        </div>
      }
    >
      {groups.length === 0 && !loading &&
        <p>{activeGame.name} doesn&apos;t have any groups yet</p>
      }

      {error && <ErrorMessage error={error} />}

      {groups.length > 0 &&
        <>
          <Table columns={['Name', 'Description', 'Players', 'Last updated', '']}>
            <TableBody iterator={sortedGroups}>
              {(group) => (
                <>
                  <TableCell>{group.name}</TableCell>
                  <TableCell className='w-96'>{group.description}</TableCell>
                  <TableCell>{group.count}</TableCell>
                  <DateCell>{format(new Date(group.updatedAt), 'do MMM Y')}</DateCell>
                  <TableCell className='w-40'>
                    <Button
                      variant='grey'
                      onClick={() => onEditGroupClick(group)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </>
              )}
            </TableBody>
          </Table>
        </>
      }

      {showModal &&
        <GroupDetails
          modalState={[showModal, setShowModal]}
          mutate={mutate}
          editingGroup={editingGroup}
        />
      }
    </Page>
  )
}
