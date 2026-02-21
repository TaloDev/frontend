import { useReactFlow } from '@xyflow/react'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { useDebounce } from 'use-debounce'
import saveDataNodeSizesState from '../../state/saveDataNodeSizesState'

export const minZoom = 0.1

export default function SaveContentFitManager() {
  const reactFlow = useReactFlow()
  const nodeSizes = useRecoilValue(saveDataNodeSizesState)

  const [debouncedLength] = useDebounce(nodeSizes.length, 100)

  useEffect(() => {
    if (debouncedLength > 0) {
      void reactFlow.fitView({
        minZoom,
      })
    }
  }, [debouncedLength, reactFlow])

  return null
}
