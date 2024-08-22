import { User } from '@sentry/react'
import { UserType } from '../entities/user'

export enum PermissionBasedAction {
  DELETE_LEADERBOARD,
  DELETE_STAT,
  DELETE_GROUP,
  DELETE_FEEDBACK_CATEGORY,
  VIEW_PLAYER_AUTH_ACTIVITIES
}

export default function canPerformAction(user: User, action: PermissionBasedAction) {
  if (user.type === UserType.OWNER) return true

  switch (action) {
    case PermissionBasedAction.DELETE_LEADERBOARD:
    case PermissionBasedAction.DELETE_STAT:
    case PermissionBasedAction.DELETE_FEEDBACK_CATEGORY:
    case PermissionBasedAction.VIEW_PLAYER_AUTH_ACTIVITIES:
      return user.type === UserType.ADMIN
    case PermissionBasedAction.DELETE_GROUP:
      return [UserType.DEV, UserType.ADMIN].includes(user.type)
  }
}
