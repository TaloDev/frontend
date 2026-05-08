import { UserType } from '../entities/user'

const userTypeMap = {
  [UserType.OWNER]: 'Owner',
  [UserType.ADMIN]: 'Admin',
  [UserType.DEV]: 'Dev',
}

export default userTypeMap
