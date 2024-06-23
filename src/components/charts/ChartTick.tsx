type ChartTickProps = {
  x?: number
  y?: number
  payload?: { value: string | number }
  formatter: (value: string | number) => string | number
  transform: (x?: number, y?: number) => string
}

export default function ChartTick({ x, y, payload, formatter, transform }: ChartTickProps) {
  return (
    <g transform={transform(x, y)}>
      <text x={0} y={0} dy={16} textAnchor='end' className='fill-current text-white text-sm'>
        {payload && formatter(payload.value)}
      </text>
    </g>
  )
}
