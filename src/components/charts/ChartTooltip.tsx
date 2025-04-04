import { format } from 'date-fns'
import { uniqBy } from 'lodash-es'
import clsx from 'clsx'
import getEventColour from '../../utils/getEventColour'
import { z } from 'zod'
import { eventsVisualisationPayloadSchema } from '../../api/useEvents'

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
      <p className='text-black font-medium text-sm'>{format(new Date(label!), 'EEEE do MMM yyyy')}</p>
      <ul className='space-y-4 mt-4'>
        {uniqBy(filteredItems, 'payload.name')
          .sort((a, b) => b.payload.count - a.payload.count)
          .map((item, idx) => (
            <li key={idx} className='text-black grid grid-cols-[2fr_1fr_0.5fr] items-center gap-4 rounded-md'>
              <div className='flex items-center text-sm'>
                <span
                  className='w-4 h-4 rounded inline-block mr-2'
                  style={{ backgroundColor: getEventColour(item.payload.name) }}
                />
                {item.payload.name}
              </div>

              <span className='font-mono text-sm text-right font-medium'>{item.payload.count.toLocaleString()}</span>

              <span
                className={clsx(
                  'p-1 rounded text-xs text-center',
                  {
                    'bg-red-100 text-red-600': item.payload.change < 0,
                    'bg-green-100 text-green-600': item.payload.change > 0,
                    'bg-gray-100 text-gray-600': item.payload.change === 0
                  }
                )}
              >
                {(item.payload.change * 100).toFixed(1)}%
              </span>
            </li>
          ))}
      </ul>
    </div>
  )
}
