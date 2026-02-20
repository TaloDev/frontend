import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import useGameActivities from '../api/useGameActivities'
import ActivityRenderer from '../components/ActivityRenderer'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import Pagination from '../components/Pagination'
import SecondaryNav from '../components/SecondaryNav'
import { secondaryNavRoutes } from '../constants/secondaryNavRoutes'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import useDaySections from '../utils/useDaySections'

export default function Activity() {
  const [page, setPage] = useState(0)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const { activities, count, itemsPerPage, loading, error } = useGameActivities(activeGame, page)
  const sections = useDaySections(activities)

  return (
    <Page
      title='Activity log'
      isLoading={loading}
      secondaryNav={<SecondaryNav routes={secondaryNavRoutes} />}
    >
      {!error && !loading && sections.length === 0 && (
        <p>{activeGame.name} doesn&apos;t have any activity yet</p>
      )}

      {!error &&
        sections.map((section, sectionIdx) => (
          <ActivityRenderer key={sectionIdx} section={section} />
        ))}

      {error && <ErrorMessage error={error} />}

      {!!count && (
        <Pagination count={count} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />
      )}
    </Page>
  )
}
