import { useContext } from 'react'
import { useRecoilValue } from 'recoil'
import updatePlayer from '../api/updatePlayer'
import Loading from '../components/Loading'
import Page from '../components/Page'
import PlayerIdentifier from '../components/PlayerIdentifier'
import PropsEditor from '../components/PropsEditor'
import ToastContext, { ToastType } from '../components/toast/ToastContext'
import { Prop } from '../entities/prop'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import usePlayer from '../utils/usePlayer'

export default function PlayerProps() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const [player] = usePlayer()

  const toast = useContext(ToastContext)

  const onSave = async (props: Prop[]): Promise<Prop[]> => {
    if (!player) {
      throw new Error('Player not found')
    }

    const { player: updatedPlayer } = await updatePlayer(activeGame.id, player.id, { props })

    toast.trigger('Props updated', ToastType.SUCCESS)

    return updatedPlayer.props
  }

  if (!player) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return (
    <Page showBackButton containerClassName='w-full lg:w-2/3' title='Player properties'>
      <PlayerIdentifier player={player} />

      <PropsEditor
        startingProps={player.props}
        onSave={onSave}
        noPropsMessage='This player has no custom properties'
      />
    </Page>
  )
}
