import { format } from 'date-fns'
import { ReactNode } from 'react'

type BarChartTooltipProps = {
  active?: boolean
  payload?: { payload: Record<string, number> }[]
  label?: number
  formatter: (payload: Record<string, number>) => ReactNode
}

export function BarChartTooltip({ active, payload, label, formatter }: BarChartTooltipProps) {
  if (!active || !payload?.length || label === undefined) return null

  return (
    <div className='bg-white p-4 rounded'>
      <p className='text-black font-medium text-sm'>{format(new Date(label), 'dd MMM yyyy')}</p>
      <p className='text-black font-mono text-sm font-medium mt-2'>
        {formatter(payload[0].payload)}
      </p>
    </div>
  )
}
