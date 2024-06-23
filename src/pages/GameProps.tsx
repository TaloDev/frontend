import Page from '../components/Page'
import activeGameState, { SelectedActiveGameState } from '../state/activeGameState'
import { useRecoilState } from 'recoil'
import PropsEditor from '../components/PropsEditor'
import updateGame from '../api/updateGame'
import { Prop } from '../entities/prop'

export default function GameProps() {
  const [activeGame, setActiveGame] = useRecoilState(activeGameState) as SelectedActiveGameState

  const onSave = async (props: Prop[]): Promise<Prop[]> => {
    const { game } = await updateGame(activeGame.id, { props })
    setActiveGame(game)
    return game.props
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
