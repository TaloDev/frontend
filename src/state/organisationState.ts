import { atom } from 'jotai'
import { userState, AuthedUser } from './userState'

export const organisationState = atom((get) => (get(userState) as AuthedUser).organisation)
