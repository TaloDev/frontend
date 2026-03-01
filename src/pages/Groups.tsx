import { IconPinned, IconPinnedFilled, IconPlus } from '@tabler/icons-react'
import Tippy from '@tippyjs/react'
import { format } from 'date-fns'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import togglePinnedGroup from '../api/toggledPinnedGroup'
import useGroups from '../api/useGroups'
import usePinnedGroups from '../api/usePinnedGroups'
import Button from '../components/Button'
import { NoGroups } from '../components/empty-states/NoGroups'
import ErrorMessage from '../components/ErrorMessage'
import Identifier from '../components/Identifier'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import TextInput from '../components/TextInput'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import routes from '../constants/routes'
import { PlayerGroup } from '../entities/playerGroup'
import GroupDetails from '../modals/groups/GroupDetails'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import useSortedItems from '../utils/useSortedItems'

export default function Groups() {
  const initialSearch = new URLSearchParams(window.location.search).get('search')
  const [search, setSearch] = useState(initialSearch ?? '')

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const [showModal, setShowModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<PlayerGroup | null>(null)

  const { groups, loading, error, mutate } = useGroups(activeGame)

  const filteredGroups = useMemo(() => {
    if (!search) {
      return groups
    }

    const lower = search.toLowerCase()
    return groups.filter((group) => {
      const groupName = group.name.toLowerCase()
      return groupName.includes(lower) || group.id.includes(lower)
    })
  }, [groups, search])

  const sortedGroups = useSortedItems(filteredGroups, 'name', 'asc')

  const { groups: pinnedGroups, mutate: mutatePinnedGroups } = usePinnedGroups(activeGame)

  const navigate = useNavigate()

  const toast = useContext(ToastContext)

  useEffect(() => {
    if (!showModal) {
      setEditingGroup(null)
    }
  }, [showModal, editingGroup])

  const onEditGroupClick = (group: PlayerGroup) => {
    setEditingGroup(group)
    setShowModal(true)
  }

  const goToPlayersForGroup = (group: PlayerGroup) => {
    navigate(`${routes.players}?search=group:${group.id}`)
  }

  const isPinned = useCallback(
    (group: PlayerGroup) => {
      return pinnedGroups.find((pg) => pg.id === group.id)
    },
    [pinnedGroups],
  )

  const togglePinned = useCallback(
    async (group: PlayerGroup) => {
      try {
        await togglePinnedGroup(activeGame.id, group.id, !isPinned(group))
        await mutatePinnedGroups(
          (data) => ({
            ...data,
            groups: isPinned(group)
              ? data!.groups.filter((pg) => pg.id !== group.id)
              : [...data!.groups, group],
          }),
          false,
        )

        const toastMessage = isPinned(group)
          ? `${group.name} unpinned`
          : `${group.name} pinned to your dashboard`
        toast.trigger(toastMessage, ToastType.SUCCESS)
      } catch {
        toast.trigger(`Failed to pin ${group.name}`, ToastType.ERROR)
      }
    },
    [activeGame.id, isPinned, mutatePinnedGroups, toast],
  )

  return (
    <Page
      title='Groups'
      isLoading={loading}
      showBackButton={Boolean(initialSearch)}
      extraTitleComponent={
        <div className='mt-1 ml-4 rounded-full bg-indigo-600 p-1'>
          <Button
            variant='icon'
            onClick={() => setShowModal(true)}
            icon={<IconPlus />}
            extra={{ 'aria-label': 'Create group' }}
          />
        </div>
      }
    >
      {(sortedGroups.length > 0 || search.length > 0) && (
        <div className='flex items-center'>
          <div className='w-1/2 grow md:grow-0 lg:w-1/4'>
            <TextInput
              id='groups-search'
              type='search'
              placeholder='Search...'
              onChange={setSearch}
              value={search}
            />
          </div>
        </div>
      )}

      {sortedGroups.length === 0 && !loading && (
        <>{search.length > 0 ? <p>No groups match your query</p> : <NoGroups />}</>
      )}

      {error && <ErrorMessage error={error} />}

      {sortedGroups.length > 0 && (
        <>
          <Table columns={['ID', 'Name', 'Players', 'Last updated', '', '']}>
            <TableBody iterator={sortedGroups}>
              {(group) => (
                <>
                  <TableCell className='min-w-80'>
                    <div className='flex flex-row items-center space-x-4'>
                      {pinnedGroups && (
                        <Tippy
                          content={
                            <p>{isPinned(group) ? 'Unpin group' : 'Pin group to dashboard'}</p>
                          }
                        >
                          <div className='inline-block'>
                            {isPinned(group) && (
                              <Button
                                variant='icon'
                                className='rounded-full bg-indigo-900 p-1'
                                icon={<IconPinnedFilled />}
                                onClick={() => togglePinned(group)}
                              />
                            )}
                            {!isPinned(group) && (
                              <Button
                                variant='icon'
                                className='rounded-full bg-indigo-900 p-1'
                                icon={<IconPinned />}
                                onClick={() => togglePinned(group)}
                              />
                            )}
                          </div>
                        </Tippy>
                      )}
                      <Identifier id={group.id} />
                    </div>
                  </TableCell>
                  <TableCell className='max-w-[320px] min-w-[320px] lg:min-w-0'>
                    {group.name}
                    <div className='mt-2 text-sm'>{group.description}</div>
                  </TableCell>
                  <TableCell className='font-mono'>{group.count.toLocaleString()}</TableCell>
                  <DateCell>{format(new Date(group.updatedAt), 'dd MMM yyyy')}</DateCell>
                  <TableCell className='w-40'>
                    <Button variant='grey' onClick={() => onEditGroupClick(group)}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell className='w-48'>
                    <Button variant='grey' onClick={() => goToPlayersForGroup(group)}>
                      View players
                    </Button>
                  </TableCell>
                </>
              )}
            </TableBody>
          </Table>
        </>
      )}

      {showModal && (
        <GroupDetails
          modalState={[showModal, setShowModal]}
          mutate={mutate}
          editingGroup={editingGroup}
        />
      )}
    </Page>
  )
}
