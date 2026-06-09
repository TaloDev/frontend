import { IconShieldHalf } from '@tabler/icons-react'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { EmptyState } from './EmptyState'

export function NoVerificationKeys() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  return (
    <EmptyState
      title={`${activeGame.name} doesn't have any verification keys yet`}
      icon={<IconShieldHalf size={32} />}
      learnMoreLink='https://trytalo.com/verification-keys'
      docs={{
        api: 'https://docs.trytalo.com/docs/http/game-verification-key-api',
        godot: 'https://docs.trytalo.com/docs/godot/verification-keys',
        unity: 'https://docs.trytalo.com/docs/unity/verification-keys',
      }}
    >
      <p>
        Talo's verification system prevents replay attacks and tampered requests using shared
        secrets between your game and Talo.
      </p>
    </EmptyState>
  )
}
