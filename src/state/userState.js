import { atom } from 'recoil'

const userState = atom({
  key: 'user',
  default: null
})

export default userState
