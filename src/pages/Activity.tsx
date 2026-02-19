import { useState } from 'react'
import useGameActivities from '../api/useGameActivities'
import ErrorMessage from '../components/ErrorMessage'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import SecondaryNav from '../components/SecondaryNav'
import { secondaryNavRoutes } from '../constants/secondaryNavRoutes'
import Page from '../components/Page'
import useDaySections from '../utils/useDaySections'
import ActivityRenderer from '../components/ActivityRenderer'
import Pagination from '../components/Pagination'

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
      {!error && !loading && sections.length === 0 &&
        <p>{activeGame.name} doesn&apos;t have any activity yet</p>
      }

      {!error && sections.map((section, sectionIdx) => (
        <ActivityRenderer key={sectionIdx} section={section} />
      ))}

      {error && <ErrorMessage error={error} />}

      {!!count && <Pagination count={count} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />}
    </Page>
  )
}
