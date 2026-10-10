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

const GODOT_TYPE_PREFIX = /^[A-Za-z_][A-Za-z0-9_]*\[/

export function stripGodotTypePrefix(s: string): string | null {
  if (!s.endsWith(')')) {
    return null
  }

  const prefix = GODOT_TYPE_PREFIX.exec(s)
  if (!prefix) {
    return null
  }

  // scan to the bracket matching the type-args opener; type args nest, so
  // `Array[Array[String]]([])` cannot be matched with a regex
  let depth = 0
  let cursor = prefix[0].length - 1

  for (; cursor < s.length; cursor++) {
    if (s[cursor] === '[') {
      depth++
    }

    if (s[cursor] === ']') {
      depth--

      if (depth === 0) {
        break
      }
    }
  }

  // `Type(args)`: the `(` must follow the type args and wrap the whole payload
  if (depth !== 0 || s[cursor + 1] !== '(') {
    return null
  }

  return s.slice(cursor + 2, -1)
}

/**
 * Decode a JSON string once, then once more if it held a string.
 *
 * @example
 * '{"a": 1}'      -> { a: 1 }
 * '"{\\"a\\": 1}"' -> { a: 1 }  (double-encoded payload)
 * 'nope'          -> not parsed
 */
function parseJson(s: string): { parsed: boolean; value?: unknown } {
  try {
    const value = JSON.parse(s)

    if (typeof value !== 'string') {
      return { parsed: true, value }
    }

    try {
      return { parsed: true, value: JSON.parse(value) }
    } catch {
      return { parsed: true, value }
    }
  } catch {
    return { parsed: false }
  }
}

function decodeString(s: string): unknown {
  const result = parseJson(s)
  if (result.parsed) {
    return decodeValue(result.value)
  }

  const stripped = stripGodotTypePrefix(s)
  if (stripped === null) {
    return s
  }

  const strippedResult = parseJson(stripped)
  return strippedResult.parsed ? decodeValue(strippedResult.value) : s
}

function decodeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return decodeString(value)
  }

  if (Array.isArray(value)) {
    return value.map(decodeValue)
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, decodeValue(v)]))
  }

  return value
}

/**
 * Expand JSON-encoded strings into their parsed structure, so the node walkers
 * can branch on save data instead of rendering it as one flat text row.
 * Returns a new tree; the input (React state) is never mutated.
 */
export function normaliseContent(content: Record<string, unknown>): Record<string, unknown> {
  return decodeValue(content) as Record<string, unknown>
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
