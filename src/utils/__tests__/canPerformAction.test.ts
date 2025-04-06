import userMock from '../../__mocks__/userMock'
import { UserType } from '../../entities/user'
import canPerformAction, { PermissionBasedAction } from '../canPerformAction'

describe('canPerformAction', () => {
  it('should always return true for owner users', () => {
    const user = userMock({ type: UserType.OWNER })
    expect(canPerformAction(user, PermissionBasedAction.DELETE_LEADERBOARD)).toBe(true)
  })
})
