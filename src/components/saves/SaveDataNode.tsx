import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { NodeDataRow } from '../../utils/useNodeGraph'
import { Handle, Position } from '@xyflow/react'
import { useSetRecoilState } from 'recoil'
import saveDataNodeSizesState from '../../state/saveDataNodeSizesState'
import clsx from 'clsx'

type SaveDataNodeProps = {
  id: string
  data: { rows: NodeDataRow[], search: string }
}

function SaveDataNode({ id, data }: SaveDataNodeProps ) {
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
            height: ref.current!.clientHeight
          }
        ]
      })
    }
  }, [id, setNodeSizes])

  const valueIsNumber = useCallback((value: unknown) => {
    return !isNaN(Number(value))
  }, [])

  const valueIsBoolean = useCallback((value: unknown) => {
    return ['true', 'false'].includes(String(value))
  }, [])

  const valueIsString = useCallback((value: unknown) => {
    return !valueIsNumber(value) && !valueIsBoolean(value)
  }, [valueIsNumber, valueIsBoolean])

  const composeClassNames = useCallback((value: unknown) => {
    return clsx({
      'text-orange-300': valueIsString(value),
      'text-emerald-300': valueIsNumber(value),
      'text-rose-300': valueIsBoolean(value)
    })
  }, [valueIsString, valueIsNumber, valueIsBoolean])

  const renderItem = useCallback((item: string) => {
    if (valueIsString(item)) {
      return `"${item}"`
    }
    return item
  }, [valueIsString])

  const searchMatches = useMemo(() => {
    return data.rows.some((row) => {
      return row.item.trim().toLowerCase().includes(data.search.trim().toLowerCase())
    })
  }, [data.search, data.rows])

  return (
    <div ref={ref} className={clsx('py-4 px-8 rounded bg-gray-900 border-2 border-gray-500 transition-all', {
      'bg-opacity-30': data.search !== '' && !searchMatches
    })}>
      <div className={clsx('transition-opacity -mx-4', { 'opacity-30': data.search !== '' && !searchMatches })}>
        {data.rows.map((row, idx) => (
          <div
            key={idx}
            className={clsx('text-sm text-white font-mono text-nowrap', {
              'text-center': data.rows.length === 1
            })}
          >
            {row.type === 'array' &&
              <>
                <span className='font-medium'>{row.item.split(' ')[0]} </span>
                <span className='text-indigo-300'>{row.item.split(' ')[1]}</span>
              </>
            }
            {row.type !== 'array' && /(.*: .*)\w+/.test(row.item) &&
              <>
                <span className='font-medium'>{row.item.split(' ')[0]} </span>
                <span className={composeClassNames(row.item.split(' ')[1])}>
                  {renderItem(row.item.split(' ')[1])}
                </span>
              </>
            }
            {row.type !== 'array' && !/(.*: .*)\w+/.test(row.item) &&
              <span
                className={composeClassNames(row.item)}>
                {renderItem(row.item)}
              </span>
            }
          </div>
        ))}

        <Handle type='target' position={Position.Top} className='invisible mt-1' />
        <Handle type='source' position={Position.Bottom} className='invisible' />
      </div>
    </div>
  )
}

export default memo(SaveDataNode)
