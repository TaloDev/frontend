import { selector } from 'recoil'
import userState from './userState'

const organisationState = selector({
  key: 'organisation',
  get: ({ get }) => {
    const user = get(userState)
    return user?.organisation ?? {}
  }
})

export default organisationState
