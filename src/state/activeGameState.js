import { atom } from 'recoil'

const activeGameState = atom({
  key: 'activeGame',
  default: JSON.parse(window.localStorage.getItem('activeGame')),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((updatedActiveGame) => {
        window.localStorage.setItem('activeGame', JSON.stringify(updatedActiveGame))
      })
    }
  ]
})

export default activeGameState
