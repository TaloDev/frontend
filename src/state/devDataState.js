import { atom } from 'recoil'

const devDataState = atom({
  key: 'includeDevData',
  default: JSON.parse(window.localStorage.getItem('includeDevData')) ?? true,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((includeDevData) => {
        window.localStorage.setItem('includeDevData', JSON.stringify(includeDevData))
      })
    }
  ]
})

export default devDataState
