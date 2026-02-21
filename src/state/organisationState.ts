import { selector } from 'recoil'
import { Organisation } from '../entities/organisation'
import userState, { AuthedUser } from './userState'

const organisationState = selector<Organisation>({
  key: 'organisation',
  get: ({ get }) => {
    const user = get(userState) as AuthedUser
    return user.organisation
  },
})

export default organisationState
