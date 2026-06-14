import { ReactElement } from 'react'
import { ResponsiveContainer } from 'recharts'

type Props = {
  children: ReactElement
}

export function EventChartContainer({ children }: Props) {
  return (
    <ResponsiveContainer height={600} className='w-full'>
      {children}
    </ResponsiveContainer>
  )
}
