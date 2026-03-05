import { IconBubbleText } from '@tabler/icons-react'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { EmptyState } from './EmptyState'

export function NoFeedback() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  return (
    <EmptyState
      title={`${activeGame.name} doesn't have any feedback yet`}
      icon={<IconBubbleText size={32} />}
      learnMoreLink='https://trytalo.com/feedback'
      docs={{
        api: 'https://docs.trytalo.com/docs/http/game-feedback-api',
        godot: 'https://docs.trytalo.com/docs/godot/feedback',
        unity: 'https://docs.trytalo.com/docs/unity/feedback',
      }}
    >
      <p>
        Feedback from players can be filtered and sorted by categories and custom metadata. Feedback
        can be anonymous or linked to a player, so you can see exactly what happened leading up to
        it.
      </p>
    </EmptyState>
  )
}
