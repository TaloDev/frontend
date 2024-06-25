import { SetterOrUpdater, atom } from 'recoil'
import { User } from '../entities/user'

const userState = atom<User | null>({
  key: 'user',
  default: null
})

export type AuthedUser = NonNullable<User>

export type AuthedUserState = [AuthedUser, SetterOrUpdater<User | null>]

export default userState
