import Page from '../components/Page'
import activeGameState, { SelectedActiveGameState } from '../state/activeGameState'
import { useRecoilState } from 'recoil'
import PropsEditor from '../components/PropsEditor'
import updateGame from '../api/updateGame'
import { Prop } from '../entities/prop'
import { useContext } from 'react'
import ToastContext, { ToastType } from '../components/toast/ToastContext'

export default function GameProps() {
  const [activeGame, setActiveGame] = useRecoilState(activeGameState) as SelectedActiveGameState

  const toast = useContext(ToastContext)

  const onSave = async (props: Prop[]): Promise<Prop[]> => {
    const { game } = await updateGame(activeGame.id, { props })

    toast.trigger('Live config updated', ToastType.SUCCESS)

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
