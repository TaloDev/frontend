import { format } from 'date-fns'
import { uniqBy } from 'lodash-es'
import clsx from 'clsx'
import getEventColour from '../../utils/getEventColour'
import { z } from 'zod'
import { eventsVisualisationPayloadSchema } from '../../api/useEvents'
import { Fragment } from 'react/jsx-runtime'

type Payload = z.infer<typeof eventsVisualisationPayloadSchema>

type ChartTooltipProps = {
  active?: boolean
  payload?: Item[]
  label?: string
}

type Item = {
  payload: Payload
}

export default function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  const filteredItems = payload?.filter((item: Item) => item.payload.count > 0)

  if (!active || filteredItems?.length === 0) return null

  return (
    <div className='bg-white p-4 rounded'>
      <p className='text-black font-medium text-sm'>{format(new Date(label!), 'EEEE dd MMM yyyy')}</p>
      <ul className='text-black grid grid-cols-[2fr_1fr_0.5fr] gap-y-2 mt-4'>
        {uniqBy(filteredItems, 'payload.name')
          .sort((a, b) => b.payload.count - a.payload.count)
          .map((item, idx) => (
            <Fragment key={idx}>
              <li className='flex items-center text-sm'>
                <span
                  className='w-4 h-4 rounded inline-block mr-2'
                  style={{ backgroundColor: getEventColour(item.payload.name) }}
                />
                {item.payload.name}
              </li>

              <li className='flex items-center justify-end font-mono text-sm font-medium'>
                {item.payload.count.toLocaleString()}
              </li>

              <li
                className={clsx(
                  'ml-2 text-xs text-center p-1 rounded',
                  {
                    'bg-red-100 text-red-600': item.payload.change < 0,
                    'bg-green-100 text-green-600': item.payload.change > 0,
                    'bg-gray-100 text-gray-600': item.payload.change === 0
                  }
                )}
              >
                {(item.payload.change * 100).toFixed(1)}%
              </li>
            </Fragment>
          ))}
      </ul>

    </div>
  )
}
