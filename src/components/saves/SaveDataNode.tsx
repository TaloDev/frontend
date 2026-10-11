import type { ReactNode } from 'react'
import { IconCopy } from '@tabler/icons-react'
import { Handle, Position } from '@xyflow/react'
import clsx from 'clsx'
import { useSetAtom } from 'jotai'
import { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { saveDataNodeSizesState } from '../../state/saveDataNodeSizesState'
import { NodeDataRow, JSON_ROW_TYPE, parseJsonDocument } from '../../utils/nodeGraphHelpers'
import Button from '../Button'
import ToastContext from '../toast/ToastContext'

const MIN_NODE_WIDTH = 'min-w-[200px]'
const MAX_NODE_WIDTH = 'max-w-[600px]'

/**
 * JSON highlighting without a dependency: one regex pass over the pretty text.
 * Colours match the flat rows, which already style by value type.
 *
 * @example
 * {"a": [1, null]}  ->  key "a", number 1, literal null
 */
const JSON_TOKENS =
  /("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)/g
const KEY_CLASS = 'text-sky-300'
const STRING_CLASS = 'text-orange-300'
const NUMBER_CLASS = 'text-emerald-300'
const LITERAL_CLASS = 'text-rose-300'

function highlightJson(pretty: string) {
  const tokens: ReactNode[] = []
  let cursor = 0
  let index = 0

  for (const match of pretty.matchAll(JSON_TOKENS)) {
    const [text, key, string, literal] = match
    const at = match.index ?? 0

    if (at > cursor) {
      tokens.push(pretty.slice(cursor, at))
    }

    // a string before a colon is a key, the rest keeps its type colour
    const className = key
      ? KEY_CLASS
      : string
        ? STRING_CLASS
        : literal
          ? LITERAL_CLASS
          : NUMBER_CLASS

    tokens.push(
      <span key={index++} className={className}>
        {text}
      </span>,
    )

    cursor = at + text.length
  }

  if (cursor < pretty.length) {
    tokens.push(pretty.slice(cursor))
  }

  return tokens
}

/**
 * A json row keeps its raw text (search, copy button) and is only indented here,
 * so `value: {"a":{"b":1}}` prints across four lines.
 */
const JsonRow = memo(function JsonRow({ item }: { item: string }) {
  // only keyed rows carry the `value: ` prefix, array items are bare documents
  const keyed = item.startsWith(VALUE_ROW_PREFIX)
  const key = keyed ? VALUE_ROW_PREFIX.slice(0, -2) : null
  const raw = keyed ? item.slice(VALUE_ROW_PREFIX.length) : item

  const lines = useMemo(() => {
    const document = parseJsonDocument(raw)
    const pretty = document === null ? raw : JSON.stringify(document, null, 2)

    return pretty.split('\n').map((line) => ({
      indent: line.length - line.trimStart().length,
      content: highlightJson(line.trimStart()),
    }))
  }, [raw])

  // each line becomes a block, and the leading spaces of that line become its
  // padding, so a line too long for the node wraps under its own indentation
  return (
    <pre className='text-left whitespace-pre-wrap'>
      {key && <span className='font-medium'>{key}: </span>}
      {lines.map((line, index) => (
        <span key={index} className='block' style={{ paddingLeft: `${line.indent}ch` }}>
          {line.content}
        </span>
      ))}
    </pre>
  )
})

// flat rows are `key: value`, so only these hold a copyable value.
// an array node's label row is `value [3]`, which has no value to copy
const VALUE_ROW_PREFIX = 'value: '

type SaveDataNodeProps = {
  id: string
  data: {
    rows: NodeDataRow[]
    search: string
    formatVersion: string
    isHovered: boolean
  }
}

function SaveDataNodeComponent({ id, data }: SaveDataNodeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const setNodeSizes = useSetAtom(saveDataNodeSizesState)

  useEffect(() => {
    if (ref.current) {
      setNodeSizes((prev) => {
        return [
          ...prev.filter((size) => size.id !== id),
          {
            id,
            // a spacing hint for the layout, css owns the rendered size
            width: Math.max(ref.current!.clientWidth, 100),
            height: ref.current!.clientHeight,
          },
        ]
      })
    }
  }, [id, setNodeSizes])

  const valueIsNumber = useCallback((value: unknown) => {
    const str = String(value)
    return str !== '' && !isNaN(Number(value))
  }, [])

  const valueIsBoolean = useCallback((value: unknown) => {
    return ['true', 'false'].includes(String(value))
  }, [])

  const valueIsString = useCallback(
    (value: unknown) => {
      return !valueIsNumber(value) && !valueIsBoolean(value)
    },
    [valueIsNumber, valueIsBoolean],
  )

  const composeClassNames = useCallback(
    (value: unknown) => {
      return clsx({
        [STRING_CLASS]: valueIsString(value),
        [NUMBER_CLASS]: valueIsNumber(value),
        [LITERAL_CLASS]: valueIsBoolean(value),
      })
    },
    [valueIsString, valueIsNumber, valueIsBoolean],
  )

  const renderItem = useCallback(
    (item: string) => {
      if (valueIsString(item)) {
        if (item === '') {
          return '""'
        }
        if (data.formatVersion === 'godot.v2' && item.includes('"')) {
          return item
        }
        return `"${item}"`
      }
      return item
    },
    [data.formatVersion, valueIsString],
  )

  const renderArrayRow = useCallback((item: string) => {
    const match = item.match(/^(\S+)\s+(\[[^\]]+\])(?:\s+(\(.+\)))?$/)
    const name = match?.[1] ?? item
    const count = match?.[2] ?? ''
    const suffix = match?.[3] ?? null
    return (
      <>
        <span className='font-medium'>{name} </span>
        <span className='text-indigo-300'>{count}</span>
        {suffix && <div className='mt-1 text-xs text-yellow-400'>{suffix}</div>}
      </>
    )
  }, [])

  const searchMatches = useMemo(() => {
    return data.rows.some((row) => {
      return row.item.trim().toLowerCase().includes(data.search.trim().toLowerCase())
    })
  }, [data.search, data.rows])

  const valueRow = useMemo(() => {
    return data.rows.find((row) => row.item.startsWith(VALUE_ROW_PREFIX))
  }, [data.rows])

  const canShowCopyButton = data.isHovered && valueRow

  const toast = useContext(ToastContext)

  const copyValue = useCallback(async () => {
    if (valueRow) {
      const value = valueRow.item.slice(VALUE_ROW_PREFIX.length)
      await navigator.clipboard.writeText(value)
      toast.trigger('Value copied to clipboard')
    }
  }, [valueRow, toast])

  return (
    <div
      ref={ref}
      className={clsx(
        'rounded border-2 border-gray-500 bg-gray-900 px-8 py-4 transition-all',
        MIN_NODE_WIDTH,
        MAX_NODE_WIDTH,
        {
          'bg-opacity-30': data.search !== '' && !searchMatches,
        },
      )}
    >
      <div
        className={clsx('relative -mx-4 transition-opacity', {
          'opacity-30': data.search !== '' && !searchMatches,
        })}
      >
        {data.rows.map((row, idx) => (
          <div
            key={idx}
            className={clsx('font-mono text-sm wrap-break-word text-white', {
              'text-center': data.rows.length === 1,
            })}
          >
            {row.type === 'array' && renderArrayRow(row.item)}
            {row.type === JSON_ROW_TYPE && <JsonRow item={row.item} />}
            {row.type !== 'array' && row.type !== JSON_ROW_TYPE && row.item.includes(': ') && (
              <>
                <span className='font-medium'>{row.item.split(': ')[0]}: </span>
                <span className={composeClassNames(row.item.split(': ')[1] || '')}>
                  {renderItem(row.item.split(': ')[1] || '')}
                </span>
              </>
            )}
            {row.type !== 'array' && row.type !== JSON_ROW_TYPE && !row.item.includes(': ') && (
              <span className={composeClassNames(row.item)}>{renderItem(row.item)}</span>
            )}
          </div>
        ))}

        {canShowCopyButton && (
          <Button
            type='button'
            className='absolute top-0 right-0 w-auto!'
            icon={<IconCopy size={20} />}
            onClick={copyValue}
          />
        )}

        <Handle type='target' position={Position.Top} className='invisible mt-1' />
        <Handle type='source' position={Position.Bottom} className='invisible' />
      </div>
    </div>
  )
}

export const SaveDataNode = memo(SaveDataNodeComponent)
