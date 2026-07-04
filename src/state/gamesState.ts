import { atom } from 'jotai'
import { userState } from './userState'

export const gamesState = atom((get) => get(userState)?.organisation.games ?? [])
