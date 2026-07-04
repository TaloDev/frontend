import { useReactFlow } from '@xyflow/react'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { saveDataNodeSizesState } from '../../state/saveDataNodeSizesState'

export const minZoom = 0.1

export function SaveContentFitManager() {
  const reactFlow = useReactFlow()
  const nodeSizes = useAtomValue(saveDataNodeSizesState)

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
