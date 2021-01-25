import { atom } from 'recoil'

const gamesState = atom({
  key: 'games',
  default: []
})

export default gamesState
