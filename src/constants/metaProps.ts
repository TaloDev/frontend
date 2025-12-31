import { AvailablePlayerGroupField, PlayerGroupRuleCastType } from '../entities/playerGroup'
import { Prop } from '../entities/prop'

const META_DEV_BUILD = 'META_DEV_BUILD'
const META_OS = 'META_OS'
const META_GAME_VERSION = 'META_GAME_VERSION'
const META_WINDOW_MODE = 'META_WINDOW_MODE'
const META_SCREEN_WIDTH = 'META_SCREEN_WIDTH'
const META_SCREEN_HEIGHT = 'META_SCREEN_HEIGHT'

const META_STEAMWORKS_VAC_BANNED = 'META_STEAMWORKS_VAC_BANNED'
const META_STEAMWORKS_PUBLISHER_BANNED = 'META_STEAMWORKS_PUBLISHER_BANNED'
const META_STEAMWORKS_OWNS_APP = 'META_STEAMWORKS_OWNS_APP'
const META_STEAMWORKS_OWNS_APP_PERMANENTLY = 'META_STEAMWORKS_OWNS_APP_PERMANENTLY'
const META_STEAMWORKS_OWNS_APP_FROM_DATE = 'META_STEAMWORKS_OWNS_APP_FROM_DATE'
const META_STEAMWORKS_AVATAR_HASH = 'META_STEAMWORKS_AVATAR_HASH'
const META_STEAMWORKS_PERSONA_NAME = 'META_STEAMWORKS_PERSONA_NAME'

export const metaPropKeyMap = {
  [META_DEV_BUILD]: 'DEV BUILD',
  [META_OS]: 'OS',
  [META_GAME_VERSION]: 'GAME VERSION',
  [META_WINDOW_MODE]: 'WINDOW MODE',
  [META_SCREEN_WIDTH]: 'SCREEN WIDTH',
  [META_SCREEN_HEIGHT]: 'SCREEN HEIGHT',
  [META_STEAMWORKS_VAC_BANNED]: 'STEAMWORKS VAC BANNED',
  [META_STEAMWORKS_PUBLISHER_BANNED]: 'STEAMWORKS PUBLISHER BANNED',
  [META_STEAMWORKS_OWNS_APP]: 'STEAMWORKS OWNS APP',
  [META_STEAMWORKS_OWNS_APP_PERMANENTLY]: 'STEAMWORKS OWNS APP PERMANENTLY',
  [META_STEAMWORKS_OWNS_APP_FROM_DATE]: 'STEAMWORKS OWNS APP FROM DATE',
  [META_STEAMWORKS_AVATAR_HASH]: 'STEAMWORKS AVATAR HASH',
  [META_STEAMWORKS_PERSONA_NAME]: 'STEAM USERNAME'
}

export function isMetaProp(prop: Prop) {
  return Object.keys(metaPropKeyMap).includes(prop.key)
}

export const metaGroupFields: AvailablePlayerGroupField[] = [
  {
    fieldDisplayName: 'dev build',
    defaultCastType: PlayerGroupRuleCastType.CHAR,
    mapsTo: 'props',
    namespaced: true,
    metaProp: META_DEV_BUILD
  },
  {
    fieldDisplayName: 'operating system',
    defaultCastType: PlayerGroupRuleCastType.CHAR,
    mapsTo: 'props',
    namespaced: true,
    metaProp: META_OS
  },
  {
    fieldDisplayName: 'game version',
    defaultCastType: PlayerGroupRuleCastType.DOUBLE,
    mapsTo: 'props',
    namespaced: true,
    metaProp: META_GAME_VERSION
  },
  {
    fieldDisplayName: 'window mode',
    defaultCastType: PlayerGroupRuleCastType.DOUBLE,
    mapsTo: 'props',
    namespaced: true,
    metaProp: META_WINDOW_MODE
  },
  {
    fieldDisplayName: 'screen width',
    defaultCastType: PlayerGroupRuleCastType.DOUBLE,
    mapsTo: 'props',
    namespaced: true,
    metaProp: META_SCREEN_WIDTH
  },
  {
    fieldDisplayName: 'screen height',
    defaultCastType: PlayerGroupRuleCastType.DOUBLE,
    mapsTo: 'props',
    namespaced: true,
    metaProp: META_SCREEN_HEIGHT
  }
]
