import routes from '../constants/routes'
import userTypes from '../constants/userTypes'

/* istanbul ignore file */
export default function canViewPage(user, route) {
  if (user.type === userTypes.OWNER) return true

  switch (route) {
    case routes.activity:
      return [userTypes.ADMIN, userTypes.DEMO].includes(user.type)
    case routes.apiKeys:
      return user.type === userTypes.ADMIN
    case routes.dataExports:
      return user.type === userTypes.ADMIN && user.emailConfirmed
    case routes.organisation:
      return user.type === userTypes.ADMIN
    case routes.billing:
      return false
    default:
      return true
  }
}
