import { IconTrophy } from '@tabler/icons-react'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { EmptyState } from './EmptyState'

export function NoLeaderboards() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  return (
    <EmptyState
      title={`${activeGame.name} doesn't have any leaderboards yet`}
      icon={<IconTrophy size={32} />}
      learnMoreLink='https://trytalo.com/leaderboards'
      docs={{
        api: 'https://docs.trytalo.com/docs/http/leaderboard-api',
        godot: 'https://docs.trytalo.com/docs/godot/leaderboards',
        unity: 'https://docs.trytalo.com/docs/unity/leaderboards',
      }}
    >
      <p>
        Talo&apos;s leaderboards are highly customisable. Along with tracking scores, you can attach
        custom metadata, enable timed refreshes (e.g. daily leaderboards) and hide suspicious
        entries.
      </p>
    </EmptyState>
  )
}
