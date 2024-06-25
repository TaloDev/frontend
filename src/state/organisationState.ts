import { selector } from 'recoil'
import userState, { AuthedUser } from './userState'
import { Organisation } from '../entities/organisation'

const organisationState = selector<Organisation>({
  key: 'organisation',
  get: ({ get }) => {
    const user = get(userState) as AuthedUser
    return user.organisation
  }
})

export default organisationState
