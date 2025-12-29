import { useCallback, useContext, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import ErrorMessage from '../components/ErrorMessage'
import { format } from 'date-fns'
import { IconPinned, IconPinnedFilled, IconPlus } from '@tabler/icons-react'
import Button from '../components/Button'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import DateCell from '../components/tables/cells/DateCell'
import Page from '../components/Page'
import Table from '../components/tables/Table'
import useGroups from '../api/useGroups'
import GroupDetails from '../modals/groups/GroupDetails'
import useSortedItems from '../utils/useSortedItems'
import Identifier from '../components/Identifier'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'
import { PlayerGroup } from '../entities/playerGroup'
import Tippy from '@tippyjs/react'
import usePinnedGroups from '../api/usePinnedGroups'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import togglePinnedGroup from '../api/toggledPinnedGroup'

export default function Groups() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const [showModal, setShowModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<PlayerGroup | null>(null)

  const { groups, loading, error, mutate } = useGroups(activeGame)
  const sortedGroups = useSortedItems(groups, 'name', 'asc')

  const { groups: pinnedGroups, mutate: mutatePinnedGroups } = usePinnedGroups(activeGame)

  const navigate = useNavigate()

  const toast = useContext(ToastContext)

  useEffect(() => {
    if (!showModal) setEditingGroup(null)
  }, [showModal, editingGroup])

  const onEditGroupClick = (group: PlayerGroup) => {
    setEditingGroup(group)
    setShowModal(true)
  }

  const goToPlayersForGroup = (group: PlayerGroup) => {
    navigate(`${routes.players}?search=group:${group.id}`)
  }

  const isPinned = useCallback((group: PlayerGroup) => {
    return pinnedGroups.find((pg) => pg.id === group.id)
  }, [pinnedGroups])

  const togglePinned = useCallback(async (group: PlayerGroup) => {
    try {
      await togglePinnedGroup(activeGame.id, group.id, !isPinned(group))
      mutatePinnedGroups((data) => ({
        ...data,
        groups: isPinned(group)
          ? data!.groups.filter((pg) => pg.id !== group.id)
          : [...data!.groups, group]
      }), false)
      toast.trigger(isPinned(group) ? 'Group unpinned' : 'Group pinned to your dashboard', ToastType.SUCCESS)
    } catch (err) {
      toast.trigger('Failed to pin group', ToastType.ERROR)
    }
  }, [activeGame.id, isPinned, mutatePinnedGroups, toast])

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
          <Table columns={['ID', 'Name', 'Players', 'Last updated', '', '']}>
            <TableBody iterator={sortedGroups}>
              {(group) => (
                <>
                  <TableCell className='min-w-80'>
                    <div className='flex flex-row items-center space-x-4'>
                      {pinnedGroups &&
                        <Tippy content={<p>{isPinned(group) ? 'Unpin group' : 'Pin group to dashboard'}</p>}>
                          <div className='inline-block'>
                            {isPinned(group) &&
                              <Button
                                variant='icon'
                                className='p-1 rounded-full bg-indigo-900'
                                icon={<IconPinnedFilled />}
                                onClick={() => togglePinned(group)}
                              />
                            }
                            {!isPinned(group) &&
                              <Button
                                variant='icon'
                                className='p-1 rounded-full bg-indigo-900'
                                icon={<IconPinned />}
                                onClick={() => togglePinned(group)}
                              />
                            }
                          </div>
                        </Tippy>
                      }
                      <Identifier id={group.id} />
                    </div>
                  </TableCell>
                  <TableCell className='min-w-[320px] max-w-[320px] lg:min-w-0'>
                    {group.name}
                    <div className='mt-2 text-sm'>
                      {group.description}
                    </div>
                  </TableCell>
                  <TableCell className='font-mono'>{group.count.toLocaleString()}</TableCell>
                  <DateCell>{format(new Date(group.updatedAt), 'dd MMM yyyy')}</DateCell>
                  <TableCell className='w-40'>
                    <Button
                      variant='grey'
                      onClick={() => onEditGroupClick(group)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell className='w-48'>
                    <Button
                      variant='grey'
                      onClick={() => goToPlayersForGroup(group)}
                    >
                      View players
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
