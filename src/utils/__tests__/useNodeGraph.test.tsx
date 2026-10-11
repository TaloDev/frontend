import { renderHook, waitFor } from '@testing-library/react'
import { GameSave } from '../../entities/gameSave'
import { NodeDataRow } from '../nodeGraphHelpers'
import { useLinearNodeGraph } from '../useLinearNodeGraph'
import { useNodeGraph } from '../useNodeGraph'

// content -> objects[0] -> data[0]
const ITEM_NODE = 'content-objects-0-data-0'
const ITEM_VALUE_NODE = `${ITEM_NODE}-value`

function makeSave(data: unknown[]): GameSave {
  return {
    id: 1,
    name: 'save',
    content: { content: { objects: [{ id: 'save', name: 'PlayerSave', data }] } },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

describe.each([
  ['tree', useNodeGraph],
  ['linear', useLinearNodeGraph],
])('%s node graph', (_mode, useGraph) => {
  const graphFor = async (data: unknown[]) => {
    const { result } = renderHook(() => useGraph(makeSave(data), true))
    await waitFor(() => expect(result.current.nodes.length).toBeGreaterThan(0))

    return {
      nodes: result.current.nodes,
      rowsOf: (id: string) =>
        (result.current.nodes.find((node) => node.id === id)?.data as { rows: NodeDataRow[] })
          ?.rows,
    }
  }

  it('should keep a json value in one row instead of expanding it', async () => {
    const { nodes, rowsOf } = await graphFor([
      { key: 'wallet', type: '4', value: '{"a":{"b":1}}' },
      { key: 'state_json', type: '4', value: '"{\\"coins\\":383131}"' },
    ])

    expect(rowsOf(ITEM_NODE)).toContainEqual({ item: 'value: {"a":{"b":1}}', type: 'json' })
    expect(rowsOf('content-objects-0-data-1')).toContainEqual({
      item: 'value: "{\\"coins\\":383131}"',
      type: 'json',
    })
    expect(nodes.find((node) => node.id === ITEM_VALUE_NODE)).toBeUndefined()
  })

  it('should leave every other value as a plain row', async () => {
    const { nodes, rowsOf } = await graphFor([
      { key: 'skin', type: '4', value: 'zip' },
      { key: 'blobs', type: '28', value: 'Array[String](["uv"])' },
      '{"a":1}',
    ])

    expect(rowsOf(ITEM_NODE)).toContainEqual({ item: 'value: zip', type: 'string' })
    // the godot typed container is a document once its marker is dropped
    expect(rowsOf('content-objects-0-data-1')).toContainEqual({
      item: 'value: Array[String](["uv"])',
      type: 'json',
    })
    // a json document sitting in an array is marked too
    expect(rowsOf('content-objects-0-data-2')).toStrictEqual([{ item: '{"a":1}', type: 'json' }])
    expect(nodes.find((node) => node.id === ITEM_VALUE_NODE)).toBeUndefined()
  })
})
