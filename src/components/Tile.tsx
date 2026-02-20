import type { ReactNode } from 'react'
import clsx from 'clsx'

type TileProps = {
  header: ReactNode
  content: ReactNode
  footer?: ReactNode
  selected?: boolean
}

export default function Tile({ header, content, footer, selected }: TileProps) {
  return (
    <div
      className={clsx(
        'relative block rounded border py-4 transition-colors',
        { 'border-indigo-400 bg-indigo-500': selected },
        { 'border-gray-600 bg-gray-700': !selected },
      )}
    >
      <div className='space-y-4'>
        <div className='flex items-center justify-between px-4'>{header}</div>
        <div className={clsx('my-4 h-[1px] bg-gray-600', { 'bg-indigo-400': selected })} />
        <div className='flex items-center justify-between px-4'>{content}</div>

        {footer}
      </div>
    </div>
  )
}
