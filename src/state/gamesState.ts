import { selector } from 'recoil'
import { Game } from '../entities/game'
import userState from './userState'

const gamesState = selector<Game[]>({
  key: 'games',
  get: ({ get }) => {
    const user = get(userState)
    return user?.organisation.games ?? []
  },
})

export default gamesState
