import { useMemo } from 'react'
import { YAxis } from 'recharts'
import ChartTick from './ChartTick'

const pxPerChar = 8

export function useYAxisWidth<T>({
  data,
  transformer
}: {
  data: T[]
  transformer: (d: T[]) => number[]
}) {
  const yAxisWidth = useMemo(() => {
    const maxValue = Math.max(...transformer(data), 0)
    return maxValue.toLocaleString().length * pxPerChar
  }, [data, transformer])

  return {
    yAxisWidth
  }
}

export function useYAxis<T>({
  data,
  transformer
}: {
  data: T[]
  transformer: (d: T[]) => number[]
}) {
  const { yAxisWidth } = useYAxisWidth({
    data,
    transformer
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
      tick: tickComponent
    } as React.ComponentProps<typeof YAxis>
  }
}
