import { useNavigate } from 'react-router-dom'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import routes from '../constants/routes'
import { format } from 'date-fns'
import DateCell from '../components/tables/cells/DateCell'
import useSortedItems from '../utils/useSortedItems'
import Page from '../components/Page'
import PlayerIdentifier from '../components/PlayerIdentifier'
import usePlayer from '../utils/usePlayer'
import Table from '../components/tables/Table'
import SecondaryTitle from '../components/SecondaryTitle'
import PlayerAliases from '../components/PlayerAliases'
import Identifier from '../components/Identifier'
import { IconArrowRight, IconBolt, IconChartBar, IconDeviceFloppy, IconLock, IconSettings, IconTrash, IconTrophy } from '@tabler/icons-react'
import Button from '../components/Button'
import Loading from '../components/Loading'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState, { AuthedUser } from '../state/userState'
import clsx from 'clsx'
import Tile from '../components/Tile'
import { useCallback, useContext, useMemo, useState } from 'react'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import deletePlayer from '../api/deletePlayer'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'
import { PropBadges } from '../components/PropBadges'
import { PlayerAliasService } from '../entities/playerAlias'

const links = [
  {
    name: 'Properties',
    icon: IconSettings,
    route: routes.playerProps
  },
  {
    name: 'Auth logs',
    icon: IconLock,
    route: routes.playerAuthActivities
  },
  {
    name: 'Events',
    icon: IconBolt,
    route: routes.playerEvents
  },
  {
    name: 'Stats',
    icon: IconChartBar,
    route: routes.playerStats
  },
  {
    name: 'Entries',
    icon: IconTrophy,
    route: routes.playerLeaderboardEntries
  },
  {
    name: 'Saves',
    icon: IconDeviceFloppy,
    route: routes.playerSaves
  }
]

export default function PlayerProfile() {
  const [player] = usePlayer()
  const navigate = useNavigate()

  const sortedAliases = useSortedItems(player?.aliases ?? [], 'lastSeenAt')

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const user = useRecoilValue(userState) as AuthedUser
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useContext(ToastContext)

  const goToPlayerRoute = useCallback((route: string) => {
    if (!player) {
      throw new Error('Player not found')
    }

    navigate(route.replace(':id', player.id))
  }, [navigate, player])

  const goToGroup = useCallback((groupId: string) => {
    navigate(`${routes.groups}?search=${groupId}`)
  }, [navigate])

  const onDeleteClick = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        await deletePlayer(activeGame.id, player!.id)
      } catch (err) {
        setIsDeleting(false)
        toast.trigger('Something went wrong while deleting the player', ToastType.ERROR)
        return
      }

      toast.trigger('Player deleted')

      setTimeout(() => {
        navigate(routes.players)
      }, 2000)
    }
  }, [activeGame.id, navigate, player, toast])

  const filteredLinks = useMemo(() => {
    if (!player) {
      return []
    }

    return links.filter(({ route }) => {
      const taloAlias = player.aliases.find((alias) => alias.service === PlayerAliasService.TALO)
      if (route === routes.playerAuthActivities && !taloAlias) {
        return false
      }
      return true
    })
  }, [player])

  if (!player) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return (
    <Page
      showBackButton
      title='Player profile'
      isLoading={!player}
    >
      <div>
        <PlayerIdentifier player={player} />
        <div className='flex mt-4 space-x-2'>
          <Identifier id={`Registered ${format(new Date(player.createdAt), 'dd MMM yyyy')}`} />
          <Identifier id={`Last seen ${format(new Date(player.lastSeenAt), 'dd MMM yyyy')}`} />
          <span className={clsx(player.presence?.online && 'text-green-400')}>
            <Identifier id={`${player.presence?.online ? 'Online' : 'Offline'}${player.presence?.customStatus ? ` (${player.presence.customStatus})` : ''}`} />
          </span>
        </div>
      </div>

      <div className='inline-grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4'>
        {filteredLinks.map((link) => (
          <Button
            key={link.name}
            variant='grey'
            onClick={() => goToPlayerRoute(link.route)}
            icon={<link.icon size={16} />}
          >
            <span>{link.name}</span>
          </Button>
        ))}
      </div>

      <SecondaryTitle>Aliases</SecondaryTitle>

      <Table columns={['Alias', 'Created at', 'Last seen']}>
        <TableBody
          iterator={sortedAliases}
          configureClassnames={(_, idx) => ({
            'bg-orange-600': player.devBuild && idx % 2 !== 0,
            'bg-orange-500': player.devBuild && idx % 2 === 0
          })}
        >
          {(alias) => (
            <>
              <TableCell className='min-w-60'><PlayerAliases aliases={[alias]} /></TableCell>
              <DateCell>{format(new Date(alias.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
              <DateCell>{format(new Date(alias.lastSeenAt), 'dd MMM yyyy, HH:mm')}</DateCell>
            </>
          )}
        </TableBody>
      </Table>

      {player.groups.length > 0 &&
        <>
          <SecondaryTitle>Groups</SecondaryTitle>

          <PropBadges
            props={player.groups.map(({ id, name }) => ({ key: id, value: name }))}
            className='flex flex-wrap gap-4 w-full lg:w-3/4 xl:w-1/2'
            contentRenderer={({ value: name }) => <span className='text-sm'>{name}</span>}
            icon={<IconArrowRight size={20} />}
            onClick={(p) => goToGroup(p.key)}
            buttonTitle='Go to group'
          />
        </>
      }

      {canPerformAction(user, PermissionBasedAction.DELETE_PLAYER) &&
        <>
          <SecondaryTitle>Danger zone</SecondaryTitle>
          <div className='p-4 border-2 border-dashed border-red-400 rounded w-full lg:w-3/4 xl:w-1/2'>
            <Tile
              header={(
                <h2 className='text-xl font-semibold'>Delete player</h2>
              )}
              content={(
                <div className='sm:flex items-center justify-between sm:space-x-4 space-y-4 sm:space-y-0'>
                  <p className='sm:w-3/4'>This will remove all data associated with this player and they will no longer have access to their account. <span className='font-semibold'>This action cannot be undone</span>.</p>
                  <Button
                    type='button'
                    isLoading={isDeleting}
                    onClick={onDeleteClick}
                    variant='red'
                    className='w-auto!'
                    icon={<IconTrash />}
                  >
                    <span>
                      Delete
                    </span>
                  </Button>
                </div>
              )}
            />
          </div>
        </>
      }
    </Page>
  )
}
