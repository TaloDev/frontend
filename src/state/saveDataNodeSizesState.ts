import { atom } from 'recoil'

export type SaveDataNodeSize = {
  id: string
  width: number
  height: number
}

const saveDataNodeSizesState = atom<SaveDataNodeSize[]>({
  key: 'saveDataNodeSizes',
  default: []
})

export default saveDataNodeSizesState
