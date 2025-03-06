import routes from '../constants/routes'
import { User, UserType } from '../entities/user'

export default function canViewPage(user: User | null, route: string) {
  if (!user) return false
  if (user.type === UserType.OWNER) return true

  switch (route) {
    case routes.activity:
    case routes.integrations:
    case routes.gameProps:
      return [UserType.ADMIN, UserType.DEMO].includes(user.type)
    case routes.apiKeys:
      return user.type === UserType.ADMIN
    case routes.dataExports:
      return user.type === UserType.ADMIN && user.emailConfirmed
    case routes.organisation:
      return user.type === UserType.ADMIN
    case routes.billing:
      return false
    case routes.feedbackCategories:
      return [UserType.ADMIN, UserType.DEV].includes(user.type)
    default:
      return true
  }
}
