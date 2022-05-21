import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import findPlayer from '../api/findPlayer'
import routes from '../constants/routes'
import activeGameState from '../state/activeGameState'

function usePlayer({ onLoaded } = {}) {
  const { id } = useParams()
  const location = useLocation()

  const [player, setPlayer] = useState(location.state?.player)
  const activeGame = useRecoilValue(activeGameState)

  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      if (!player) {
        try {
          const res = await findPlayer(activeGame.id, id)
          const player = res.data.players.find((p) => p.id === id)

          if (player) {
            setPlayer(player)
            onLoaded?.(player)
          } else {
            navigate(routes.players, { replace: true })
          }
        } catch (err) {
          navigate(routes.players, { replace: true })
        }
      }
    })()
  }, [])

  return [player, setPlayer]
}

export default usePlayer
