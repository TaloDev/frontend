import routes from '../constants/routes'
import { User, UserType } from '../entities/user'

export default function canViewPage(user: User | null, route: string) {
  if (!user) return false
  if (user.type === UserType.OWNER) return true

  switch (route) {
    case routes.activity:
    case routes.apiKeys:
    case routes.gameProps:
    case routes.integrations:
    case routes.organisation:
    case routes.verificationKeys:
      return user.type === UserType.ADMIN
    case routes.dataExports:
      return user.type === UserType.ADMIN && user.emailConfirmed
    case routes.feedbackCategories:
      return [UserType.ADMIN, UserType.DEV].includes(user.type)
    case routes.billing:
    case routes.gameSettings:
      return false
    default:
      return true
  }
}
