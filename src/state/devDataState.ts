import { AtomEffect, atom } from 'recoil'

const localStorageEffect: AtomEffect<boolean> = ({ setSelf, onSet }) => {
  if (!window.localStorage.getItem(key)) {
    setSelf(true)
    window.localStorage.setItem(key, 'true')
  }

  onSet((includeDevData: boolean) => {
    window.localStorage.setItem(key, String(includeDevData))
  })
}

const key = 'includeDevData'
const devDataState = atom<boolean>({
  key,
  default: window.localStorage.getItem(key) === 'true',
  effects: [localStorageEffect],
})

export default devDataState
