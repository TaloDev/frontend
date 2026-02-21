import { Edge, Node } from '@xyflow/react'
import dagre from 'dagre'
import { SaveDataNodeSize } from '../state/saveDataNodeSizesState'

export type NodeDataRow = {
  item: string
  type: string
}

export function objectToRows(obj: { [key: string]: unknown }): NodeDataRow[] {
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([, v]) => !Array.isArray(v) && typeof v !== 'object'),
  )

  return Object.entries(filtered).map(([key, value]) => ({
    item: `${key}: ${value}`,
    type: typeof value,
  }))
}

export function getNodeSize(id: string, nodeSizes: SaveDataNodeSize[]) {
  const nodeSize = nodeSizes.find((size) => size.id === id)
  if (nodeSize) {
    return { width: nodeSize.width, height: nodeSize.height }
  }

  return { width: 0, height: 0 }
}

export function getLayoutedElements(
  nodes: Set<Node>,
  edges: Set<Edge>,
  nodeSizes: SaveDataNodeSize[],
): Node[] {
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
        y: dagreNode.y - dagreNode.height / 2,
      },
      draggable: false,
      width: dagreNode.width > 0 ? dagreNode.width : undefined,
      height: dagreNode.height > 0 ? dagreNode.height : undefined,
    } as Node
  })

  return newNodes
}
