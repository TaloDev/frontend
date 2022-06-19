export const metaPropKeyMap = {
  'META_DEV_BUILD': 'DEV BUILD',
  'META_OS': 'OS',
  'META_GAME_VERSION': 'GAME VERSION',
  'META_WINDOW_MODE': 'WINDOW MODE',
  'META_SCREEN_WIDTH': 'SCREEN WIDTH',
  'META_SCREEN_HEIGHT': 'SCREEN HEIGHT'
}

export function isMetaProp(prop) {
  return Object.keys(metaPropKeyMap).includes(prop.key)
}
