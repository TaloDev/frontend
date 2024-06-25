import { format } from 'date-fns'
import { uniqBy } from 'lodash-es'
import clsx from 'clsx'
import getEventColour from '../../utils/getEventColour'

type Payload = {
  count: number
  name: string
  change: number
}

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
      <p className='text-black font-medium mb-2'>{format(new Date(label!), 'EEEE do MMM yyyy')}</p>
      <ul className='space-y-2'>
        {uniqBy(filteredItems, 'payload.name')
          .sort((a, b) => b.payload.count - a.payload.count)
          .map((item, idx) => (
            <li key={idx}>
              <p className='text-black text-sm'>
                <span className='mr-2 w-4 h-4 rounded inline-block align-text-bottom' style={{ backgroundColor: getEventColour(item.payload.name) }} />
                {item.payload.name}: {item.payload.count}

                <span className={clsx(
                  'p-1 rounded ml-2 text-xs',
                  {
                    'bg-red-100': item.payload.change < 0,
                    'bg-green-100': item.payload.change > 0,
                    'bg-gray-100': item.payload.change === 0
                  }
                )}>
                  {(item.payload.change * 100).toFixed(1)}%
                </span>
              </p>
            </li>
          ))}
      </ul>
    </div>
  )
}
