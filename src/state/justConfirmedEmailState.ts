import { atom } from 'recoil'

const justConfirmedEmailState = atom<boolean>({
  key: 'justConfirmedEmail',
  default: false,
})

export default justConfirmedEmailState
