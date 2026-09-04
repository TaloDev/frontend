import { IconChartFunnel } from '@tabler/icons-react'
import { useAtomValue } from 'jotai'
import { activeGameState, SelectedActiveGame } from '../../state/activeGameState'
import { EmptyState } from './EmptyState'

export function NoEventFunnels() {
  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame

  return (
    <EmptyState
      title={`${activeGame.name} doesn't have any funnels yet`}
      icon={<IconChartFunnel size={32} />}
    >
      <p>
        Funnels track how many players progress through an ordered sequence of events. Add up to 5
        steps and see where players drop off.
      </p>
    </EmptyState>
  )
}
