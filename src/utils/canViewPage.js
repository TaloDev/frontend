import routes from '../constants/routes'
import userTypes from '../constants/userTypes'

export default function canViewPage(user, route) {
  switch (route) {
    case routes.apiKeys:
      return user.type === userTypes.ADMIN
    case routes.dataExports:
      return user.type === userTypes.ADMIN && user.emailConfirmed
    default:
      return true
  }
}
