import SecondaryTitle from './SecondaryTitle'
import { format } from 'date-fns'

type ActivityRendererProps = {
  section: {
    date: Date
    items: {
      createdAt: string
      description: string
      extra?: Record<string, unknown>
    }[]
  }
}

export default function ActivityRenderer({ section }: ActivityRendererProps) {
  return (
    <div className='space-y-4'>
      <SecondaryTitle className='text-lg'>{format(section.date, 'dd MMM yyyy')}</SecondaryTitle>

      {section.items.map((item, itemIdx) => (
        <div key={itemIdx} className='border-t-2 border-gray-700 pt-4'>
          <p><span className='text-sm mr-2 text-indigo-300'>{format(new Date(item.createdAt), 'HH:mm')}</span> {item.description}</p>

          {item.extra &&
            <div className='-ml-2 flex flex-wrap'>
              {Object.keys(item.extra).sort((a, b) => {
                if (b === 'Player') return 1

                return a.localeCompare(b)
              }).map((key) => (
                <code key={key} className='bg-gray-900 rounded p-2 text-xs md:text-sm ml-2 mt-2'>{key} = {String((item.extra ?? {})[key])}</code>
              ))}
            </div>
          }
        </div>
      ))}
    </div>
  )
}
