import { useReactFlow } from '@xyflow/react'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import saveDataNodeSizesState from '../../state/saveDataNodeSizesState'
import { useDebounce } from 'use-debounce'

export default function SaveContentFitManager() {
  const reactFlow = useReactFlow()
  const nodeSizes = useRecoilValue(saveDataNodeSizesState)

  const [debouncedLength] = useDebounce(nodeSizes.length, 100)

  useEffect(() => {
    if (debouncedLength > 0) {
      reactFlow.fitView()
    }
  }, [debouncedLength, reactFlow])

  return null
}
