import { IconSocial } from '@tabler/icons-react'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { EmptyState } from './EmptyState'

export function NoGroups() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  return (
    <EmptyState
      title={`${activeGame.name} doesn't have any groups yet`}
      icon={<IconSocial size={32} />}
      learnMoreLink='https://trytalo.com/players#groups'
      docs={{
        api: 'https://docs.trytalo.com/docs/http/player-group-api',
        godot: 'https://docs.trytalo.com/docs/godot/groups',
        unity: 'https://docs.trytalo.com/docs/unity/groups',
      }}
    >
      <p>
        Groups let you sort players based on stats, leaderboards, sessions or props. These segments
        live-update and can be queried in-game, allow you to trigger custom logic for different
        players.
      </p>
    </EmptyState>
  )
}
