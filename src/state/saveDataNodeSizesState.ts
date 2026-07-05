import { atom } from 'jotai'

export type SaveDataNodeSize = {
  id: string
  width: number
  height: number
}

export const saveDataNodeSizesState = atom<SaveDataNodeSize[]>([])
