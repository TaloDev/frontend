import clsx from 'clsx'
import { format } from 'date-fns'
import { uniqBy } from 'lodash-es'
import { Fragment } from 'react'
import { z } from 'zod'
import { eventsVisualisationPayloadSchema } from '../../api/useEvents'
import { getPersistentColor } from '../../utils/getPersistentColour'

type Payload = z.infer<typeof eventsVisualisationPayloadSchema>

type ChartTooltipProps = {
  active?: boolean
  payload?: Item[]
  label?: string
}

type Item = {
  payload: Payload
}

export function EventChartTooltip({ active, payload, label }: ChartTooltipProps) {
  const filteredItems = payload?.filter((item: Item) => item.payload.count > 0)

  if (!active || filteredItems?.length === 0) return null

  return (
    <div className='rounded bg-white p-4'>
      <p className='text-sm font-medium text-black'>
        {format(new Date(label!), 'EEEE dd MMM yyyy')}
      </p>
      <ul className='mt-4 grid grid-cols-[2fr_1fr_0.5fr] gap-y-2 text-black'>
        {uniqBy(filteredItems, 'payload.name')
          .sort((a, b) => b.payload.count - a.payload.count)
          .map((item, idx) => (
            <Fragment key={idx}>
              <li className='flex items-center text-sm'>
                <span
                  className='mr-2 inline-block h-4 w-4 rounded'
                  style={{ backgroundColor: getPersistentColor(item.payload.name) }}
                />
                {item.payload.name}
              </li>

              <li className='flex items-center justify-end font-mono text-sm font-medium'>
                {item.payload.count.toLocaleString()}
              </li>

              <li
                className={clsx('ml-2 rounded p-1 text-center text-xs', {
                  'bg-red-100/50 text-red-600': item.payload.change < 0,
                  'bg-green-100/50 text-green-600': item.payload.change > 0,
                  'bg-gray-100 text-gray-600': item.payload.change === 0,
                })}
              >
                {(item.payload.change * 100).toFixed(1)}%
              </li>
            </Fragment>
          ))}
      </ul>
    </div>
  )
}
