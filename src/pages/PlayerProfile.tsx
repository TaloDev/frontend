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
import { IconBolt, IconChartBar, IconDeviceFloppy, IconSettings, IconTrophy } from '@tabler/icons-react'
import Button from '../components/Button'
import Loading from '../components/Loading'
import usePlayerAuthActivities from '../api/usePlayerAuthActivities'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import useDaySections from '../utils/useDaySections'
import ActivityRenderer from '../components/ActivityRenderer'
import userState, { AuthedUser } from '../state/userState'

const links = [
  {
    name: 'Properties',
    icon: IconSettings,
    route: routes.playerProps
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
  const { activities } = usePlayerAuthActivities(activeGame, player?.id, user)

  const sections = useDaySections(activities)

  const goToPlayerRoute = (route: string) => {
    navigate(route.replace(':id', player?.id), {
      state: { player }
    })
  }

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
          <Identifier id={`Registered ${format(new Date(player.createdAt), 'do MMM Y')}`} />
          <Identifier id={`Last seen ${format(new Date(player.lastSeenAt), 'do MMM Y')}`} />
        </div>
      </div>

      <div className='inline-grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4'>
        {links.map((link) => (
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
              <DateCell>{format(new Date(alias.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
              <DateCell>{format(new Date(alias.lastSeenAt), 'dd MMM Y, HH:mm')}</DateCell>
            </>
          )}
        </TableBody>
      </Table>

      {activities.length > 0 &&
        <>
          <SecondaryTitle>Authentication activities</SecondaryTitle>

          {sections.map((section, sectionIdx) => (
            <ActivityRenderer key={sectionIdx} section={section} />
          ))}
        </>
      }
    </Page>
  )
}
