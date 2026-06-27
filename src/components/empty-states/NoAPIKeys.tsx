import { IconKey } from '@tabler/icons-react'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { EmptyState } from './EmptyState'

export function NoAPIKeys() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  return (
    <EmptyState
      title={`${activeGame.name} doesn't have any access keys yet`}
      icon={<IconKey size={32} />}
    >
      <p>
        Access keys allow your game to communicate with Talo.
        <br />
        Create your first key to get started.
      </p>
    </EmptyState>
  )
}
