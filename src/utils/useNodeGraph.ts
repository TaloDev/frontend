import { Edge, Node } from '@xyflow/react'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useDebounce } from 'use-debounce'
import { GameSave } from '../entities/gameSave'
import saveDataNodeSizesState from '../state/saveDataNodeSizesState'
import {
  NodeDataRow,
  objectToRows,
  getLayoutedElements,
  getVisibleArrayItems,
} from './nodeGraphHelpers'

export function useNodeGraph(save: GameSave | null, enabled: boolean, search: string = '') {
  const content = save?.content

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [committedSearch, setCommittedSearch] = useState(search)

  const nodeSizes = useRecoilValue(saveDataNodeSizesState)
  const [debouncedNodeSizes] = useDebounce(nodeSizes, 100)
  const [debouncedSearch] = useDebounce(search, 300)

  useEffect(() => {
    if (!content || !enabled) return

    const nodeSet = new Set<Node>()
    const edgeSet = new Set<Edge>()
    const formatVersion = (content.version as string) ?? ''

    const addNode = (id: string, rows: NodeDataRow[]) => {
      nodeSet.add({ id, position: { x: 0, y: 0 }, data: { rows, formatVersion } })
    }

    // oxlint-disable-next-line typescript/no-explicit-any
    const processContent = (key: string, value: any, parentKey: string | null = null) => {
      const nodeId = parentKey ? `${parentKey}-${key}` : key

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          const { visible, label } = getVisibleArrayItems(value, debouncedSearch)

          // arrays get their own nodes
          addNode(nodeId, [{ item: label(key), type: 'array' }])

          // edge connecting the array node to its parent, if applicable
          if (parentKey) {
            edgeSet.add({ id: `${parentKey}-${nodeId}`, source: parentKey, target: nodeId })
          }

          // oxlint-disable-next-line typescript/no-explicit-any
          visible.forEach((item: any, index: number) => {
            if (typeof item === 'object' && item !== null) {
              // objects get their own nodes
              processContent(String(index), item, nodeId)
            } else {
              // primitive array items
              const itemId = `${nodeId}-${index}`
              addNode(itemId, [{ item: String(item), type: typeof item }])
              edgeSet.add({ id: `${nodeId}-${index}`, source: nodeId, target: itemId })
            }
          })
        } else {
          addNode(nodeId, objectToRows(value))

          // edge connecting this object node to its parent, if applicable
          if (parentKey) {
            edgeSet.add({ id: `${parentKey}-${nodeId}`, source: parentKey, target: nodeId })
          }

          // recursively process nested objects
          for (const subKey in value) {
            if (typeof value[subKey] === 'object' && value[subKey] !== null) {
              processContent(subKey, value[subKey], nodeId)
            }
          }
        }
      }
    }

    for (const key in content) {
      processContent(key, content[key])
    }

    const edgeArray = Array.from(edgeSet)
    void getLayoutedElements(nodeSet, edgeSet, debouncedNodeSizes).then((layoutedNodes) => {
      setNodes(layoutedNodes)
      setEdges(edgeArray)
      setCommittedSearch(debouncedSearch)
    })
  }, [content, debouncedNodeSizes, debouncedSearch, enabled])

  return { nodes, edges, committedSearch }
}
