import { IconUser } from '@tabler/icons-react'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { EmptyState } from './EmptyState'

export function NoPlayers() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  return (
    <EmptyState
      title={`${activeGame.name} doesn't have any players yet`}
      icon={<IconUser size={32} />}
      learnMoreLink='https://trytalo.com/players'
      docs={{
        api: 'https://docs.trytalo.com/docs/http/player-api',
        godot: 'https://docs.trytalo.com/docs/godot/identifying',
        unity: 'https://docs.trytalo.com/docs/unity/identifying',
      }}
    >
      <p>
        Players can be created with or without authentication - they can be completely anonymous or
        linked to a third party service like Steam. Players can also have custom metadata attached
        to them that persist across sessions.
      </p>
    </EmptyState>
  )
}
