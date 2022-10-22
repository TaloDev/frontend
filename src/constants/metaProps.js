const META_DEV_BUILD = 'META_DEV_BUILD'
const META_OS = 'META_OS'
const META_GAME_VERSION = 'META_GAME_VERSION'
const META_WINDOW_MODE = 'META_WINDOW_MODE'
const META_SCREEN_WIDTH = 'META_SCREEN_WIDTH'
const META_SCREEN_HEIGHT = 'META_SCREEN_HEIGHT'

export const metaPropKeyMap = {
  [META_DEV_BUILD]: 'DEV BUILD',
  [META_OS]: 'OS',
  [META_GAME_VERSION]: 'GAME VERSION',
  [META_WINDOW_MODE]: 'WINDOW MODE',
  [META_SCREEN_WIDTH]: 'SCREEN WIDTH',
  [META_SCREEN_HEIGHT]: 'SCREEN HEIGHT'
}

export function isMetaProp(prop) {
  return Object.keys(metaPropKeyMap).includes(prop.key)
}

export const metaGroupFields = [
  {
    field: 'dev build',
    defaultCastType: 'CHAR',
    mapsTo: META_DEV_BUILD
  },
  {
    field: 'operating system',
    defaultCastType: 'CHAR',
    mapsTo: META_OS
  },
  {
    field: 'game version',
    defaultCastType: 'DOUBLE',
    mapsTo: META_GAME_VERSION
  },
  {
    field: 'window mode',
    defaultCastType: 'DOUBLE',
    mapsTo: META_WINDOW_MODE
  },
  {
    field: 'screen width',
    defaultCastType: 'DOUBLE',
    mapsTo: META_SCREEN_WIDTH
  },
  {
    field: 'screen height',
    defaultCastType: 'DOUBLE',
    mapsTo: META_SCREEN_HEIGHT
  }
]
