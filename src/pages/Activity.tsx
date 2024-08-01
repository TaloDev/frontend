import useGameActivities from '../api/useGameActivities'
import ErrorMessage from '../components/ErrorMessage'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import SecondaryNav from '../components/SecondaryNav'
import { secondaryNavRoutes } from '../pages/Dashboard'
import Page from '../components/Page'
import useDaySections from '../utils/useDaySections'
import ActivityRenderer from '../components/ActivityRenderer'

export default function Activity() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const { activities, loading, error } = useGameActivities(activeGame)
  const sections = useDaySections(activities)

  return (
    <Page
      title='Activity log'
      isLoading={loading}
      secondaryNav={<SecondaryNav routes={secondaryNavRoutes} />}
    >
      {!error && !loading && sections.length === 0 &&
        <p>{activeGame.name} doesn&apos;t have any activity yet</p>
      }

      {!error && sections.map((section, sectionIdx) => (
        <ActivityRenderer key={sectionIdx} section={section} />
      ))}

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
