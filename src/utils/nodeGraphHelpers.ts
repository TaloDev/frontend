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

export const JSON_ROW_TYPE = 'json'

const IDENTIFIER = /[A-Za-z_][A-Za-z0-9_]*\[/y
const TYPED_CONTAINER = /^[A-Za-z_][A-Za-z0-9_]*\[/

function endOfString(s: string, open: number) {
  let escaped = false

  for (let i = open + 1; i < s.length; i++) {
    if (escaped) {
      escaped = false
      continue
    }

    if (s[i] === '\\') {
      escaped = true
      continue
    }

    if (s[i] === '"') {
      return i
    }
  }

  return s.length
}

const CLOSERS: Record<string, string> = { '[': ']', '{': '}' }

// index of the bracket or brace closing the one at `open`, strings skipped
function endOfBlock(s: string, open: number) {
  const close = CLOSERS[s[open]]
  let depth = 0

  for (let i = open; close && i < s.length; i++) {
    if (s[i] === '"') {
      i = endOfString(s, i)
      continue
    }

    if (s[i] === s[open]) {
      depth++
    }

    if (s[i] === close && --depth === 0) {
      return i
    }
  }

  return -1
}

// bounds of the godot marker opening at `open`: the payload it wraps, plus
// where the marker ends. `Array[String](["a"])` gives `["a"]` and the index
// after its `)`, or null when the text is not a marker
function markerBounds(s: string, open: number) {
  const args = endOfBlock(s, open)
  const from = args === -1 ? -1 : args + 2

  if (from === -1 || s[args + 1] !== '(') {
    return null
  }

  const close = endOfBlock(s, from)
  if (close === -1 || s[close + 1] !== ')') {
    return null
  }

  // keep the payload's own closing bracket, step over the marker's `)`
  return { from, end: close + 1, next: close + 2 }
}

/**
 * Godot's var_to_str marks every container: `Array[String](["a"])`,
 * `Dictionary[String, int]({"a": 1})`, and it does so inside nested values too,
 * which makes JSON.parse reject an otherwise valid document. Drop the markers,
 * keeping the payload; `["a)b"]` survives because strings are skipped.
 */
function stripTypedContainers(s: string): string {
  let out = ''
  let index = 0

  while (index < s.length) {
    IDENTIFIER.lastIndex = index
    const prefix = IDENTIFIER.exec(s)
    const marker = prefix ? markerBounds(s, index + prefix[0].length - 1) : null

    if (marker === null) {
      out += s[index]
      index++
      continue
    }

    // markers nest inside payloads, strip those too
    out += stripTypedContainers(s.slice(marker.from, marker.end))
    index = marker.next
  }

  return out
}

// json, or json with godot's container markers stripped
function tryParse(s: string): unknown {
  try {
    return JSON.parse(s)
  } catch {
    try {
      return JSON.parse(stripTypedContainers(s))
    } catch {
      return undefined
    }
  }
}

/**
 * The JSON document inside a value string, or null when it holds none. Covers
 * godot's typed containers and values encoded twice, as in `"{\\"a\\":1}"`.
 * `1.50`, `true` and `"zip"` are values, not documents, and stay as stored.
 */
export function parseJsonDocument(s: string): object | null {
  if (!s.startsWith('{') && !s.startsWith('[') && !s.startsWith('"') && !TYPED_CONTAINER.test(s)) {
    return null
  }

  const decoded = tryParse(s)

  if (typeof decoded === 'object' && decoded !== null) {
    return decoded
  }

  // double encoded: the value is a json string holding the json document
  const twice = typeof decoded === 'string' ? tryParse(decoded) : null

  return typeof twice === 'object' && twice !== null ? twice : null
}

export function typeOfRow(value: unknown) {
  if (typeof value === 'string' && parseJsonDocument(value) !== null) {
    return JSON_ROW_TYPE
  }

  return typeof value
}

export function objectToRows(obj: { [key: string]: unknown }): NodeDataRow[] {
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([, v]) => !Array.isArray(v) && typeof v !== 'object'),
  )

  return Object.entries(filtered).map(([key, value]) => ({
    item: `${key}: ${String(value)}`,
    type: typeOfRow(value),
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
    } as Node
  })
}
