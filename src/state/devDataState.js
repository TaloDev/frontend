import { atom } from 'recoil'

const localStorageEffect = ({ setSelf, onSet }) => {
  if (!window.localStorage.getItem(key)) {
    setSelf(true)
    window.localStorage.setItem(key, 'true')
  }

  onSet((includeDevData) => {
    window.localStorage.setItem(key, JSON.stringify(includeDevData))
  })
}

const key = 'includeDevData'
const devDataState = atom({
  key,
  default: window.localStorage.getItem(key) === 'true',
  effects: [
    localStorageEffect
  ]
})

export default devDataState
