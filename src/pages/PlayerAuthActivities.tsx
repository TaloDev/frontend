import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import usePlayerAuthActivities from '../api/usePlayerAuthActivities'
import ActivityRenderer from '../components/ActivityRenderer'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import Pagination from '../components/Pagination'
import PlayerIdentifier from '../components/PlayerIdentifier'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState, { AuthedUser } from '../state/userState'
import useDaySections from '../utils/useDaySections'
import usePlayer from '../utils/usePlayer'

export default function PlayerAuthActivities() {
  const [page, setPage] = useState(0)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const user = useRecoilValue(userState) as AuthedUser
  const [player] = usePlayer()

  const {
    activities,
    count,
    itemsPerPage,
    loading: activitiesLoading,
    error,
  } = usePlayerAuthActivities(activeGame, user, player?.id, page)
  const sections = useDaySections(activities)

  const loading = !player || activitiesLoading

  return (
    <Page showBackButton title='Auth logs' isLoading={loading}>
      <PlayerIdentifier player={player} />

      {!error && !loading && sections.length === 0 && (
        <p>This player doesn&apos;t have any authentication activities yet</p>
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
