const userTypes = {
  OWNER: 0,
  ADMIN: 1,
  DEV: 2,
  DEMO: 3
}

export const userTypeMap = {
  [userTypes.OWNER]: 'Owner',
  [userTypes.ADMIN]: 'Admin',
  [userTypes.DEV]: 'Dev'
}

export default userTypes
