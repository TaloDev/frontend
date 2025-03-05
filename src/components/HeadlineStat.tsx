import clsx from 'clsx'

type HeadlineStatProps = {
  title: string
  stat: string | number
  className?: string
}

export default function HeadlineStat({ className, title, stat }: HeadlineStatProps) {
  return (
    <div className={clsx('rounded border-2 border-gray-700 w-full text-center md:text-left', className)}>
      <div className='p-4 bg-gray-700'>
        <h3 className='text-lg font-bold'>{title}</h3>
      </div>

      <div className='p-4'>
        <p className='text-4xl md:text-6xl'>{stat.toLocaleString()}</p>
      </div>
    </div>
  )
}
