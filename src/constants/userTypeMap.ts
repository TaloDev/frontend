import { UserType } from '../entities/user'

export const userTypeMap = {
  [UserType.OWNER]: 'Owner',
  [UserType.ADMIN]: 'Admin',
  [UserType.DEV]: 'Dev',
}

export const userTypeArticle = {
  [UserType.OWNER]: 'an',
  [UserType.ADMIN]: 'an',
  [UserType.DEV]: 'a',
}

export const userTypeOptions = [
  {
    label: 'Developer',
    value: UserType.DEV,
    desc: 'Developers can create entities such as trackable stats and also update entities like players and leaderboard entries',
  },
  {
    label: 'Admin',
    value: UserType.ADMIN,
    desc: 'Admins can perform destructive actions such as deleting leaderboards but can also create access keys and export data',
  },
]
