import React from 'react'
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
import { IconBolt, IconChartBar, IconSettings, IconTrophy } from '@tabler/icons'
import Button from '../components/Button'
import Loading from '../components/Loading'

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
  }
]

export default function PlayerProfile() {
  const [player] = usePlayer()
  const navigate = useNavigate()

  const sortedAliases = useSortedItems(player?.aliases ?? [], 'updatedAt')

  const goToPlayerRoute = (route) => {
    navigate(route.replace(':id', player.id), {
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

      <Table columns={['Alias', 'Created at', 'Updated at']}>
        <TableBody
          iterator={sortedAliases}
          configureClassNames={(_, idx) => ({
            'bg-orange-600': player.devBuild && idx % 2 !== 0,
            'bg-orange-500': player.devBuild && idx % 2 === 0
          })}
        >
          {(alias) => (
            <>
              <TableCell className='min-w-60'><PlayerAliases aliases={[alias]} /></TableCell>
              <DateCell>{format(new Date(alias.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
              <DateCell>{format(new Date(alias.updatedAt), 'dd MMM Y, HH:mm')}</DateCell>
            </>
          )}
        </TableBody>
      </Table>
    </Page>
  )
}
