import { format } from 'date-fns'
import { ReactNode } from 'react'

type ChartCardTooltipProps<T> = {
  active?: boolean
  payload?: { payload: T }[]
  label?: number
  formatter: (payload: T) => ReactNode
}

export function ChartCardTooltip<T>({ active, payload, label, formatter }: ChartCardTooltipProps<T>) {
  if (!active || !payload?.length || label === undefined) return null

  return (
    <div className='bg-white p-4 rounded'>
      <p className='text-black font-medium text-sm'>{format(new Date(label), 'dd MMM yyyy')}</p>
      {formatter(payload[0].payload)}
    </div>
  )
}
