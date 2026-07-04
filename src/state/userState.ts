import type { SetStateAction } from 'jotai'
import { atom } from 'jotai'
import { User } from '../entities/user'

export const userState = atom<User | null>(null)

export type AuthedUser = NonNullable<User>
export type AuthedUserState = [AuthedUser, (action: SetStateAction<User | null>) => void]
