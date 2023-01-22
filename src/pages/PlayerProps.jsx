import Page from '../components/Page'
import updatePlayer from '../api/updatePlayer'
import Loading from '../components/Loading'
import PlayerIdentifier from '../components/PlayerIdentifier'
import usePlayer from '../utils/usePlayer'
import activeGameState from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import PropsEditor from '../components/PropsEditor'

function PlayerProps() {
  const activeGame = useRecoilValue(activeGameState)

  const [player] = usePlayer()

  const onSave = async (props) => {
    const res = await updatePlayer(activeGame.id, player.id, { props })
    return res.data.player.props
  }

  if (!player) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return (
    <Page
      showBackButton
      containerClassName='w-full lg:w-2/3'
      title='Player properties'
    >
      <PlayerIdentifier player={player} />

      <PropsEditor
        startingProps={player.props}
        onSave={onSave}
        noPropsMessage='This player has no custom properties'
      />
    </Page>
  )
}

export default PlayerProps
