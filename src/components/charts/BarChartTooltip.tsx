import { format } from 'date-fns'
import { ReactNode } from 'react'

type BarChartTooltipProps<T> = {
  active?: boolean
  payload?: { payload: T }[]
  label?: number
  formatter: (payload: T) => ReactNode
}

export function BarChartTooltip<T>({ active, payload, label, formatter }: BarChartTooltipProps<T>) {
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
