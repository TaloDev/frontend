import { UserType } from '../../entities/user'
import canPerformAction, { PermissionBasedAction } from '../canPerformAction'

describe('canPerformAction', () => {
  it('should always return true for owner users', () => {
    expect(canPerformAction({ type: UserType.OWNER }, PermissionBasedAction.DELETE_LEADERBOARD)).toBe(true)
  })
})
