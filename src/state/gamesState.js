import { selector } from 'recoil'
import userState from './userState'

const gamesState = selector({
  key: 'games',
  get: ({ get }) => {
    const user = get(userState)
    return user?.organisation.games ?? []
  }
})

export default gamesState
