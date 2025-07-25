import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import routes from '../constants/routes'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import type { Player } from '../entities/player'
import useFindPlayer from '../api/useFindPlayer'

function usePlayer(): [Player | undefined, (player: Player) => void] {
  const { id } = useParams()

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const [player, setPlayer] = useState<Player | undefined>()
  const { player: fetchedPlayer, loading } = useFindPlayer(activeGame, id)

  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return

    if (fetchedPlayer) {
      setPlayer(fetchedPlayer)
    } else {
      navigate(routes.players, { replace: true })
    }
  }, [fetchedPlayer, loading, navigate])

  return [player, setPlayer]
}

export default usePlayer
