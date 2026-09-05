import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { Player } from '../entities/player'
import useFindPlayer from '../api/useFindPlayer'
import routes from '../constants/routes'
import { activeGameState, SelectedActiveGame } from '../state/activeGameState'

function usePlayer(): [Player | undefined, (player: Player) => void] {
  const { id } = useParams()

  const activeGame = useAtomValue(activeGameState) as SelectedActiveGame
  const { player: fetchedPlayer, loading } = useFindPlayer(activeGame, id)

  const navigate = useNavigate()

  const [player, setPlayer] = useState<Player | undefined>(fetchedPlayer)
  const [prevFetchedPlayer, setPrevFetchedPlayer] = useState<Player | undefined>(fetchedPlayer)

  if (fetchedPlayer !== prevFetchedPlayer) {
    setPrevFetchedPlayer(fetchedPlayer)
    setPlayer(fetchedPlayer)
  }

  useEffect(() => {
    if (loading) return

    if (!fetchedPlayer) {
      navigate(routes.players, { replace: true })
    }
  }, [fetchedPlayer, loading, navigate])

  return [player, setPlayer]
}

export default usePlayer
