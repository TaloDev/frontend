import { SetterOrUpdater, atom } from 'recoil'
import { Game } from '../entities/game'

const activeGameState = atom<Game | null>({
  key: 'activeGame',
  default: JSON.parse(window.localStorage.getItem('activeGame') ?? 'null'),
  effects: [
    ({ onSet }) => {
      onSet((updatedActiveGame) => {
        window.localStorage.setItem('activeGame', JSON.stringify(updatedActiveGame))
      })
    },
  ],
})

export type SelectedActiveGame = NonNullable<Game>

export type SelectedActiveGameState = [SelectedActiveGame, SetterOrUpdater<Game | null>]

export default activeGameState
