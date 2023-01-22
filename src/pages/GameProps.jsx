import Page from '../components/Page'
import activeGameState from '../state/activeGameState'
import { useRecoilState } from 'recoil'
import PropsEditor from '../components/PropsEditor'
import updateGame from '../api/updateGame'

function GameProps() {
  const [activeGame, setActiveGame] = useRecoilState(activeGameState)

  const onSave = async (props) => {
    const res = await updateGame(activeGame.id, { props })
    setActiveGame(res.data.game)
    return res.data.game.props
  }

  return (
    <Page
      containerClassName='w-full lg:w-2/3'
      title={`${activeGame.name} config`}
    >
      <PropsEditor
        startingProps={activeGame.props}
        onSave={onSave}
        noPropsMessage={`${activeGame.name} has no custom properties`}
      />
    </Page>
  )
}

export default GameProps
