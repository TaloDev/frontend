import { Edge, Node } from '@xyflow/react'
import ELK from 'elkjs/lib/elk.bundled'
import { SaveDataNodeSize } from '../state/saveDataNodeSizesState'

const elk = new ELK()

export const MAX_NODE_CHILDREN = 50

export type NodeDataRow = {
  item: string
  type: string
}

// oxlint-disable-next-line typescript/no-explicit-any
export function itemMatchesSearch(item: any, search: string) {
  if (!search) {
    return false
  }

  const lower = search.trim().toLowerCase()

  if (typeof item !== 'object' || item === null) {
    return String(item).toLowerCase().includes(lower)
  }

  return JSON.stringify(item).toLowerCase().includes(lower)
}

// oxlint-disable-next-line typescript/no-explicit-any
export function getVisibleArrayItems(value: any[], search: string) {
  const visible = value.slice(0, MAX_NODE_CHILDREN)
  const hidden = value.slice(MAX_NODE_CHILDREN)

  const searchMatches = search
    ? hidden.filter((item: unknown) => itemMatchesSearch(item, search))
    : []

  const hiddenCount = hidden.length - searchMatches.length
  const all = [...visible, ...searchMatches]

  const label = (key: string) =>
    hiddenCount > 0
      ? `${key} [${value.length.toLocaleString()}] (showing ${all.length.toLocaleString()})`
      : `${key} [${value.length.toLocaleString()}]`

  return { visible: all, label }
}

export function objectToRows(obj: { [key: string]: unknown }): NodeDataRow[] {
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([, v]) => !Array.isArray(v) && typeof v !== 'object'),
  )

  return Object.entries(filtered).map(([key, value]) => ({
    item: `${key}: ${String(value)}`,
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

export async function getLayoutedElements(
  nodes: Set<Node>,
  edges: Set<Edge>,
  nodeSizes: SaveDataNodeSize[],
): Promise<Node[]> {
  const elkNodes = Array.from(nodes).map((node) => {
    const { width, height } = getNodeSize(node.id, nodeSizes)
    return { id: node.id, width, height }
  })

  const elkEdges = Array.from(edges).map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }))

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.layered.spacing.nodeNodeBetweenLayers': '60',
      'elk.spacing.nodeNode': '20',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
    },
    children: elkNodes,
    edges: elkEdges,
  }

  const layouted = await elk.layout(graph)

  const childMap = new Map(layouted.children?.map((c) => [c.id, c]) ?? [])

  return Array.from(nodes).map((node) => {
    const elkNode = childMap.get(node.id)
    return {
      ...node,
      position: {
        x: elkNode?.x ?? 0,
        y: elkNode?.y ?? 0,
      },
      draggable: false,
      width: elkNode?.width && elkNode.width > 0 ? elkNode.width : undefined,
      height: elkNode?.height && elkNode.height > 0 ? elkNode.height : undefined,
    } as Node
  })
}
