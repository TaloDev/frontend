import { useMemo, useRef } from 'react'
import { YAxis } from 'recharts'
import ChartTick from './ChartTick'

const pxPerChar = 8

function getNiceMax(maxValue: number) {
  if (maxValue <= 0) {
    return 0
  }

  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)))
  return Math.ceil(maxValue / magnitude) * magnitude
}

export function useYAxisWidth<T>({
  data,
  transformer,
}: {
  data: T[]
  transformer: (d: T[]) => number[]
}) {
  const transformerRef = useRef(transformer)
  transformerRef.current = transformer

  const yAxisWidth = useMemo(() => {
    const values = transformerRef.current(data)
    if (values.length === 0) {
      return 0
    }
    const maxValue = values.reduce((max, val) => Math.max(max, val), 0)
    const niceMax = getNiceMax(maxValue)
    return niceMax.toLocaleString().length * pxPerChar
  }, [data])

  return {
    yAxisWidth,
  }
}

export function useYAxis<T>({
  data,
  transformer,
}: {
  data: T[]
  transformer: (d: T[]) => number[]
}) {
  const { yAxisWidth } = useYAxisWidth({
    data,
    transformer,
  })

  const tickComponent = useMemo(() => {
    return (
      <ChartTick
        transform={(x, y) => {
          if (!x || !y) return ''
          return `translate(${x - 2},${y - 12})`
        }}
        formatter={(tick) => tick.toLocaleString()}
      />
    )
  }, [])

  return {
    yAxisProps: {
      allowDecimals: false,
      width: yAxisWidth,
      tick: tickComponent,
    } as React.ComponentProps<typeof YAxis>,
  }
}
