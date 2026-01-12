/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edge, Node } from '@xyflow/react'
import { useCallback, useEffect, useState } from 'react'
import dagre from 'dagre'
import { useRecoilValue } from 'recoil'
import saveDataNodeSizesState, { SaveDataNodeSize } from '../state/saveDataNodeSizesState'
import { GameSave } from '../entities/gameSave'

export type NodeDataRow = {
  item: string
  type: string
}

function objectToRows(obj: { [key: string]: any }): NodeDataRow[] {
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([, v]) => !Array.isArray(v) && typeof v !== 'object')
  )

  return Object.entries(filtered).map(([key, value]) => ({
    item: `${key}: ${value}`,
    type: typeof value
  }))
}

function getNodeSize(id: string, nodeSizes: SaveDataNodeSize[]) {
  const nodeSize = nodeSizes.find((size) => size.id === id)
  if (nodeSize) {
    return { width: nodeSize.width, height: nodeSize.height }
  }

  return { width: 0, height: 0 }
}

function getLayoutedElements(nodes: Set<Node>, edges: Set<Edge>, nodeSizes: SaveDataNodeSize[]): Node[] {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  dagreGraph.setGraph({ rankdir: 'TB' })
  nodes.forEach((node) => {
    const { width, height } = getNodeSize(node.id, nodeSizes)
    dagreGraph.setNode(node.id, { width, height })
  })
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })
  dagre.layout(dagreGraph)

  const newNodes = Array.from(nodes).map((node: Node) => {
    const dagreNode = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: dagreNode.x - dagreNode.width / 2,
        y: dagreNode.y - dagreNode.height / 2
      },
      draggable: false,
      width: dagreNode.width > 0 ? dagreNode.width : undefined,
      height: dagreNode.height > 0 ? dagreNode.height : undefined
    } as Node
  })

  return newNodes
}

export default function useLinearNodeGraph(save: GameSave | undefined, search: string = '') {
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
    if (!content) return

    const nodeSet = new Set<Node>()
    const edgeSet = new Set<Edge>()

    const addNode = (id: string, rows: NodeDataRow[]) => {
      const data = { rows, search, formatVersion: getFormatVersion() }
      nodeSet.add({ id, position: { x: 0, y: 0 }, data })
    }

    const processContent = (key: string, value: any, parentKey: string | null = null, shouldChain: boolean = false, arrayIndex: number = 0) => {
      const nodeId = parentKey ? `${parentKey}-${key}` : key

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          // arrays get their own nodes
          addNode(nodeId, [{
            item: `${key} [${value.length}]`,
            type: 'array'
          }])

          // edge connecting the array node to its parent
          if (parentKey) {
            edgeSet.add({ id: `${parentKey}-${nodeId}`, source: parentKey, target: nodeId })
          }

          // Check if this is a "data" array - only chain those
          const isDataArray = key === 'data'
          let previousItemId: string | null = null

          value.forEach((item: any, index: number) => {
            const itemId = `${nodeId}-${index}`

            if (typeof item === 'object' && item !== null) {
              // objects get their own nodes
              processContent(String(index), item, nodeId, isDataArray, index)
              previousItemId = itemId
            } else {
              // primitive array items
              addNode(itemId, [{ item: String(item), type: typeof item }])

              // chain only if this is a data array
              if (isDataArray && previousItemId) {
                edgeSet.add({ id: `${previousItemId}-${itemId}`, source: previousItemId, target: itemId })
              } else {
                edgeSet.add({ id: `${nodeId}-${itemId}`, source: nodeId, target: itemId })
              }
              previousItemId = itemId
            }
          })
        } else {
          addNode(nodeId, objectToRows(value))

          // edge connecting this object node to parent
          if (parentKey) {
            if (shouldChain) {
              // this should be chained (data array items)
              if (arrayIndex === 0) {
                edgeSet.add({ id: `${parentKey}-${nodeId}`, source: parentKey, target: nodeId })
              } else {
                const prevItemId = `${parentKey}-${arrayIndex - 1}`
                edgeSet.add({ id: `${prevItemId}-${nodeId}`, source: prevItemId, target: nodeId })
              }
            } else {
              // regular nested object, just connect to parent
              edgeSet.add({ id: `${parentKey}-${nodeId}`, source: parentKey, target: nodeId })
            }
          }

          // recursively process nested objects
          for (const subKey in value) {
            if (typeof value[subKey] === 'object' && value[subKey] !== null) {
              processContent(subKey, value[subKey], nodeId, false, 0)
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
  }, [content, getFormatVersion, nodeSizes, search])

  return { nodes, edges }
}
