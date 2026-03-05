import { IconMessages } from '@tabler/icons-react'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { EmptyState } from './EmptyState'

export function NoChannels() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  return (
    <EmptyState
      title={`${activeGame.name} doesn't have any channels yet`}
      icon={<IconMessages size={32} />}
      learnMoreLink='https://trytalo.com/channels'
      docs={{
        api: 'https://docs.trytalo.com/docs/http/game-channel-api',
        godot: 'https://docs.trytalo.com/docs/godot/channels',
        unity: 'https://docs.trytalo.com/docs/unity/channels',
      }}
    >
      <p>
        Channels can be used for player chats, sending custom data and storing data in a shared
        pool. Channels can be public, private, temporary or permanent.
      </p>
    </EmptyState>
  )
}
