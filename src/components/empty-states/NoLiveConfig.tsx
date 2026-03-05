import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { EmptyStateButtons, EmptyStateContent, EmptyStateTitle } from './EmptyState'

export function NoLiveConfig() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  return (
    <>
      <EmptyStateTitle>{activeGame.name} has no custom props</EmptyStateTitle>
      <EmptyStateButtons
        className='justify-start'
        learnMoreLink='https://trytalo.com/live-config'
        docs={{
          api: 'https://docs.trytalo.com/docs/http/game-config-api',
          godot: 'https://docs.trytalo.com/docs/godot/live-config',
          unity: 'https://docs.trytalo.com/docs/unity/live-config',
        }}
      />
      <EmptyStateContent>
        Live config is made up of custom props. These can be queried in-game to trigger custom logic
        - like for seasonal events.
      </EmptyStateContent>
    </>
  )
}
