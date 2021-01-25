import { atom } from 'recoil'

const activeGameState = atom({
  key: 'activeGame',
  default: null
})

export default activeGameState
