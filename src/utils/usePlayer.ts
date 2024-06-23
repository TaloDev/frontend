import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import findPlayer from '../api/findPlayer'
import routes from '../constants/routes'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import type { Player } from '../entities/player'

function usePlayer(): [Player, (player: Player) => void] {
  const { id } = useParams()
  const location = useLocation()

  const [player, setPlayer] = useState<Player>(location.state?.player)
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      if (!player) {
        try {
          const { players } = await findPlayer(activeGame.id, id!)
          const player = players.find((p) => p.id === id)

          if (player) {
            setPlayer(player)
          } else {
            navigate(routes.players, { replace: true })
          }
        } catch (err) {
          navigate(routes.players, { replace: true })
        }
      }
    })()
  }, [activeGame.id, id, navigate, player])

  return [player, setPlayer]
}

export default usePlayer
