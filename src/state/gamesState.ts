import { selector } from 'recoil'
import userState from './userState'
import { Game } from '../entities/game'

const gamesState = selector<Game[]>({
  key: 'games',
  get: ({ get }) => {
    const user = get(userState)
    return user?.organisation.games ?? []
  }
})

export default gamesState
