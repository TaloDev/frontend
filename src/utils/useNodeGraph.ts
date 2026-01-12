import { Edge, Node } from '@xyflow/react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import saveDataNodeSizesState from '../state/saveDataNodeSizesState'
import { GameSave } from '../entities/gameSave'
import { NodeDataRow, objectToRows, getLayoutedElements } from './nodeGraphHelpers'

export default function useNodeGraph(save: GameSave | undefined, search: string = '', enabled: boolean) {
  const content = save?.content

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const nodeSizes = useRecoilValue(saveDataNodeSizesState)

  const getFormatVersion = useCallback(() => {
    if (!content) {
      return ''
    }
    return (content.version as string) ?? ''
  }, [content])

  useEffect(() => {
    if (!content || !enabled) return

    const nodeSet = new Set<Node>()
    const edgeSet = new Set<Edge>()

    const addNode = (id: string, rows: NodeDataRow[]) => {
      const data = { rows, search, formatVersion: getFormatVersion() }
      nodeSet.add({ id, position: { x: 0, y: 0 }, data })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processContent = (key: string, value: any, parentKey: string | null = null) => {
      const nodeId = parentKey ? `${parentKey}-${key}` : key

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          // arrays get their own nodes
          addNode(nodeId, [{
            item: `${key} [${value.length}]`,
            type: 'array'
          }])

          // edge connecting the array node to its parent, if applicable
          if (parentKey) {
            edgeSet.add({ id: `${parentKey}-${nodeId}`, source: parentKey, target: nodeId })
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value.forEach((item: any, index: number) => {
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

    setNodes(getLayoutedElements(nodeSet, edgeSet, nodeSizes))
    setEdges(Array.from(edgeSet))
  }, [content, getFormatVersion, nodeSizes, search, enabled])

  return { nodes, edges }
}
