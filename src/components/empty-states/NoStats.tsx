import { IconChartBar } from '@tabler/icons-react'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { EmptyState } from './EmptyState'

export function NoStats() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  return (
    <EmptyState
      title={`${activeGame.name} doesn't have any stats yet`}
      icon={<IconChartBar size={32} />}
      learnMoreLink='https://trytalo.com/stats'
      docs={{
        api: 'https://docs.trytalo.com/docs/http/game-stat-api',
        godot: 'https://docs.trytalo.com/docs/godot/stats',
        unity: 'https://docs.trytalo.com/docs/unity/stats',
      }}
    >
      <p>
        Talo's stat tracking is a simple way to track player stats and aggregate them as global
        stats. Stats aren't just for analytics - you can also show players how stats change over
        time in-game too.
      </p>
    </EmptyState>
  )
}
