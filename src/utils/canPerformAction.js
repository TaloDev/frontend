import userTypes from '../constants/userTypes'

export const permissionBasedActions = {
  DELETE_LEADERBOARD: 'DELETE_LEADERBOARD',
  DELETE_STAT: 'DELETE_STAT',
  DELETE_GROUP: 'DELETE_GROUP',
  DELETE_FEEDBACK_CATEGORY: 'DELETE_FEEDBACK_CATEGORY'
}

export default function canPerformAction(user, action) {
  if (user.type === userTypes.OWNER) return true

  switch (action) {
    case permissionBasedActions.DELETE_LEADERBOARD:
    case permissionBasedActions.DELETE_STAT:
    case permissionBasedActions.DELETE_FEEDBACK_CATEGORY:
      return user.type === userTypes.ADMIN
    case permissionBasedActions.DELETE_GROUP:
      return [userTypes.DEV, userTypes.ADMIN].includes(user.type)
  }
}
