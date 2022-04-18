import { useEffect, useState } from 'react'
import { useLocation, useHistory, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import findPlayer from '../api/findPlayer'
import routes from '../constants/routes'
import activeGameState from '../state/activeGameState'

function usePlayer({ onLoaded } = {}) {
  const { id } = useParams()
  const location = useLocation()

  const [player, setPlayer] = useState(location.state?.player)
  const activeGame = useRecoilValue(activeGameState)

  const history = useHistory()

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
            history.replace(routes.players)
          }
        } catch (err) {
          history.replace(routes.players)
        }
      }
    })()
  }, [])

  return [player, setPlayer]
}

export default usePlayer
