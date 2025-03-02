import { User } from '@sentry/react'
import { UserType } from '../entities/user'

export enum PermissionBasedAction {
  DELETE_LEADERBOARD,
  DELETE_STAT,
  DELETE_GROUP,
  DELETE_FEEDBACK_CATEGORY,
  VIEW_PLAYER_AUTH_ACTIVITIES,
  UPDATE_PLAYER_STAT,
  UPDATE_LEADERBOARD_ENTRY,
  DELETE_CHANNEL
}

export default function canPerformAction(user: User, action: PermissionBasedAction) {
  if (user.type === UserType.OWNER) return true

  switch (action) {
    case PermissionBasedAction.DELETE_LEADERBOARD:
    case PermissionBasedAction.DELETE_STAT:
    case PermissionBasedAction.DELETE_FEEDBACK_CATEGORY:
    case PermissionBasedAction.VIEW_PLAYER_AUTH_ACTIVITIES:
    case PermissionBasedAction.UPDATE_PLAYER_STAT:
    case PermissionBasedAction.UPDATE_LEADERBOARD_ENTRY:
    case PermissionBasedAction.DELETE_CHANNEL:
      return user.type === UserType.ADMIN
    case PermissionBasedAction.DELETE_GROUP:
      return [UserType.DEV, UserType.ADMIN].includes(user.type)
  }
}
