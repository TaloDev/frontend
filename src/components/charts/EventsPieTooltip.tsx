import { Fragment } from 'react'
import { getPersistentColour } from '../../utils/getPersistentColour'

type PieTooltipProps = {
  active?: boolean
  payload?: {
    name?: string
    value?: number
    payload?: { name?: string; value?: number; fill?: string }
  }[]
  total: number
}

export function EventsPieTooltip({ active, payload, total }: PieTooltipProps) {
  const items = payload?.filter((item) => (item.value ?? 0) > 0) ?? []

  if (!active || items.length === 0 || total <= 0) {
    return null
  }

  return (
    <div className='rounded bg-white p-4'>
      <ul className='grid grid-cols-[2fr_1fr_0.5fr] gap-y-2 text-black'>
        {items.map((item, idx) => {
          const name = item.name ?? ''
          const count = item.value ?? 0
          const share = (count / total) * 100

          return (
            <Fragment key={idx}>
              <li className='flex items-center text-sm'>
                <span
                  className='mr-2 inline-block h-4 w-4 rounded'
                  style={{ backgroundColor: getPersistentColour(name) }}
                />
                {name}
              </li>
              <li className='flex items-center justify-end font-mono text-sm font-medium'>
                {count.toLocaleString()}
              </li>
              <li className='ml-2 rounded bg-gray-200 p-1 text-center text-xs text-gray-800'>
                {share.toFixed(1)}%
              </li>
            </Fragment>
          )
        })}
      </ul>
    </div>
  )
}
