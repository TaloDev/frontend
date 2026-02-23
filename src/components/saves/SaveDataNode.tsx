import { IconCopy } from '@tabler/icons-react'
import { Handle, Position } from '@xyflow/react'
import clsx from 'clsx'
import { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useSetRecoilState } from 'recoil'
import saveDataNodeSizesState from '../../state/saveDataNodeSizesState'
import { NodeDataRow } from '../../utils/nodeGraphHelpers'
import Button from '../Button'
import ToastContext from '../toast/ToastContext'

const MIN_NODE_WIDTH = 'min-w-[200px]'
const MAX_NODE_WIDTH = 'max-w-[600px]'

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
  const setNodeSizes = useSetRecoilState(saveDataNodeSizesState)

  useEffect(() => {
    if (ref.current) {
      setNodeSizes((prev) => {
        return [
          ...prev.filter((size) => size.id !== id),
          {
            id,
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
        'text-orange-300': valueIsString(value),
        'text-emerald-300': valueIsNumber(value),
        'text-rose-300': valueIsBoolean(value),
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
    return data.rows.find((row) => row.item.startsWith('value'))
  }, [data.rows])

  const canShowCopyButton = data.isHovered && valueRow

  const toast = useContext(ToastContext)

  const copyValue = useCallback(async () => {
    if (valueRow) {
      const value = valueRow.item.split(': ')[1] || ''
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
            {row.type !== 'array' && row.item.includes(': ') && (
              <>
                <span className='font-medium'>{row.item.split(': ')[0]}: </span>
                <span className={composeClassNames(row.item.split(': ')[1] || '')}>
                  {renderItem(row.item.split(': ')[1] || '')}
                </span>
              </>
            )}
            {row.type !== 'array' && !row.item.includes(': ') && (
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
