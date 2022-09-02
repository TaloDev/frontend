import userTypes from '../../constants/userTypes'
import canPerformAction, { permissionBasedActions } from '../canPerformAction'

describe('canPerformAction', () => {
  it('should always return true for owner users', () => {
    expect(canPerformAction({ type: userTypes.OWNER }, permissionBasedActions.DELETE_LEADERBOARD)).toBe(true)
  })
})
